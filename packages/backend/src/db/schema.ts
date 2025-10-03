import { pgTable, integer, text, varchar, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ulid } from "ulid";

export const formatEnum = pgEnum("format", [
    "standard",
    "pioneer",
    "modern",
    "legacy",
    "vintage",
    "pauper",
    "commander",
    "oathbreaker",
    "other",
]);

export const statusEnum = pgEnum("status", [
  "public",
  "limited",
  "private"
]);

export const boardEnum = pgEnum("board", [
  "main",
  "side",
  "commander",
  "considering",
]);

export const deckTable = pgTable("deck", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid()),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  format: formatEnum().notNull(),
  status: statusEnum().notNull().default("public"),
});

export const cardTable = pgTable("card", {
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deckId: varchar("deck_id", { length: 26 })
    .references(() => deckTable.id, { onDelete: "cascade" })
    .notNull(),
  oracleId: varchar("oracle_id", { length: 36 }).notNull(),
  imageUri: text("image_uri"),
  name: text("name").notNull(),
  cardType: text("card_type").notNull(),
  cmc: integer("cmc"),
  count: integer("count").notNull(),
  board: boardEnum().notNull().default("main"),
}, (table) => ({
  uniqueDeckCard: unique("unique_deck_oracle_board").on(
    table.deckId,
    table.oracleId,
    table.board,
  ),
}));

export const deckRelations = relations(deckTable, ({ many }) => ({
  card: many(cardTable)
}));

export const cardRelations = relations(cardTable, ({ one }) => ({
  deck: one(deckTable, {
    fields: [cardTable.deckId],
    references: [deckTable.id],
  }),
}));
