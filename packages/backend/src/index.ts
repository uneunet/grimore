import { eq } from "drizzle-orm";
import { drizzle, TiDBServerlessDatabase } from 'drizzle-orm/tidb-serverless';
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import * as schema from "./db/schema";

import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

type Bindings = {
  DB_HOST: string,
  DB_PORT: number,
  DB_PASSWORD: string,
  DB_DATABASE: string,

  CLERK_PUBLISHABLE_KEY: string,
  CLERK_SECRET_KEY: string,
}

type Variables = {
  db: TiDBServerlessDatabase<typeof schema>,
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
  .use("*", clerkMiddleware())
  .use(async (c, next) => {
    const db = drizzle({
      schema,
      connection: {
        host: c.env.DB_HOST,
        password: c.env.DB_PASSWORD,
        database: c.env.DB_DATABASE,
      },
    });

    c.set("db", db);
    await next();
  })
  .basePath("/api")
  .get(
    "/deck/:id",
    async (c) => {
      const id = c.req.param("id");
      const auth = getAuth(c);
      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: (deck, { eq }) => eq(deck.id, id),
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
  .delete(
    "/deck/:id",
    async (c) => {
      const id = c.req.param("id");
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json(
          "Forbidden",
          403,
        );
      }

      const res = await c.var.db
        .query
        .deckTable
        .findFirst({
          where: deck => eq(deck.id, id),
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

      if (res.userId !== auth.userId) {
        return c.json(
          "Forbidden",
          403
        );
      }

      await c.var.db
        .delete(schema.deckTable)
        .where(eq(schema.deckTable.userId, res.userId));

      return c.json(
        "Successfully deleted",
        200,
      );
    }
  );

export type AppType = typeof app;

export default app
