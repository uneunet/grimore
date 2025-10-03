import { connect } from "@tidbcloud/serverless";

import { and, or, eq, desc } from "drizzle-orm";
import { drizzle, TiDBServerlessDatabase } from 'drizzle-orm/tidb-serverless';
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import * as dbSchema from "./db/schema";
import { Schema } from "@grimore/shared"

import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

type Bindings = {
  DB_URL: string,

  CLERK_PUBLISHABLE_KEY: string,
  CLERK_SECRET_KEY: string,
}

type Variables = {
  db: TiDBServerlessDatabase<typeof dbSchema>,
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
  .use("*", clerkMiddleware())
  .use(async (c, next) => {
    const db = drizzle(connect({ url: c.env.DB_URL }), {
      schema: dbSchema,
    });

    c.set("db", db);
    await next();
  })
  .basePath("/api")
  .get(
    "/deck",
    zValidator(
      "query",
      z.object({
        limit: z.int().default(20),
        offset: z.int().optional(),
        userId: z.string().optional(),
      })
    ),
    async (c) => {
      const { limit, offset, userId } = c.req.valid("query");
      const auth = getAuth(c);

      const where = and(
        userId ? eq(dbSchema.deckTable.userId, userId) : undefined,
        or(
          eq(dbSchema.deckTable.status, "public"),
          auth?.userId ? eq(dbSchema.deckTable.userId, auth.userId) : undefined,
        ),
      );

      const res = await c.var.db
        .select()
        .from(dbSchema.deckTable)
        .where(where)
        .limit(limit)
        .offset(offset ? offset : 0)
        .orderBy(desc(dbSchema.deckTable.createdAt));

      if (!res) return c.json("Not found", 404);

      return c.json(res, 200); 
    }
  )
  .post(
    "/deck",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        format: Schema.Format,
        status: Schema.Status,
      }),
    ),
    async (c) => {
      const { name, format, status } = c.req.valid("json");
      const auth = getAuth(c);
      
      if (!auth?.userId) return c.json("Unauthorized", 401);

      const [{ id }] = await c.var.db
        .insert(dbSchema.deckTable)
        .values({
          userId: auth.userId,
          name,
          format,
          status
        }).$returningId();

      return c.json({ id }, 200);
    }
  )
  .get(
    "/deck/:id",
    async (c) => {
      const id = c.req.param("id");
      const auth = getAuth(c);
      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: eq(dbSchema.deckTable.id, id),
          with: {
            card: true,
          }
        });
      
      if (!res) {
        return c.json(
          "Not found",
          404,
        );
      }
      
      if (res.status === "private") {
        if (!auth?.userId || auth.userId !== res.userId) {
          return c.json(
            "Forbidden",
            403,
          )
        }
      }

      return c.json(res);
    }
  )
  .put(
    "/deck/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        format: Schema.Format.optional(),
        status: Schema.Status.optional(),
      }),
    ),
    async (c) => {
      const { name, format, status } = c.req.valid("json");
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) return c.json("Unauthorized", 401);

      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: eq(dbSchema.deckTable.id, id)
        });

      if (!res) return c.json("Not found", 404);

      if (res.userId !== auth.userId) return c.json("Forbidden", 403);

      await c.var.db
        .update(dbSchema.deckTable)
        .set({ name, format, status });

      return c.json("ok", 200);
    }
  )
  .post(
    "/deck/:id/card",
    zValidator(
      "json",
      z.object({
        oracleId: z.string(),
        imageUri: z.url(),
        name: z.string(),
        cardType: z.string(),
        cmc: z.int(),
        count: z.int(),
        board: Schema.Board,
      })
    ),
    async (c) => {
      const { oracleId, imageUri, name, cardType, cmc, count, board } = c.req.valid("json");
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) return c.json("Unauthorized", 401);

      await c.var.db
        .insert(dbSchema.cardTable)
        .ignore()
        .values({
          deckId: id,
          oracleId,
          imageUri,
          name,
          cardType,
          cmc,
          count,
          board,
        });

      return c.json("ok", 200);
    }
  )
  .put(
    "/deck/:id/card",
    zValidator(
      "json",
      z.object({
        oracleId: z.string(),
        board: Schema.Board,
        imageUri: z.url().optional(),
        count: z.int().optional(),
      })
    ),
    async (c) => {
      const { oracleId, board, imageUri, count } = c.req.valid("json");
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) return c.json("Unauthorized", 401);

      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: eq(dbSchema.deckTable.id, id)
        });

      if (!res) return c.json("Not found", 404);

      if (res.userId !== auth.userId) return c.json("Forbidden", 403);

      await c.var.db
        .update(dbSchema.cardTable)
        .set({ imageUri, count })
        .where(and(
          eq(dbSchema.cardTable.deckId, id),
          eq(dbSchema.cardTable.oracleId, oracleId),
          eq(dbSchema.cardTable.board, board)
        ));

      return c.json("ok", 200);
    }
  )
  .delete(
    "/deck/:id/card",
    zValidator(
      "json",
      z.object({
        oracleId: z.string(),
        board: Schema.Board,
      })
    ),
    async (c) => {
      const { oracleId, board } = c.req.valid("json");
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) return c.json("Unauthorized", 401);

      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: eq(dbSchema.deckTable.id, id)
        });

      if (!res) return c.json("Not found", 404);
      
      if (res.userId !== auth.userId) return c.json("Forbidden", 403);

      await c.var.db
        .delete(dbSchema.cardTable)
        .where(and(
          eq(dbSchema.cardTable.deckId, id),
          eq(dbSchema.cardTable.oracleId, oracleId),
          eq(dbSchema.cardTable.board, board)
        ));

      return c.json("ok", 200);
    }
  )
  .delete(
    "/deck/:id",
    async (c) => {
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) return c.json("Unauthorized", 401);

      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: deck => eq(deck.id, id),
          with: {
            card: true,
          }
        });

      if (!res) return c.json("Not found", 404);

      if (res.userId !== auth.userId) return c.json("Forbidden", 403);

      await c.var.db
        .delete(dbSchema.deckTable)
        .where(eq(dbSchema.deckTable.userId, res.userId));

      return c.json(
        "Successfully deleted",
        200,
      );
    }
  );

export type AppType = typeof app;

export default app
