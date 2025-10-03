import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, uniqueIndex } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { ulid } from "ulid";

export const deckTable = mysqlTable("deck", {
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
  format: mysqlEnum("format", [
    "standard",
    "pioneer",
    "modern",
    "legacy",
    "vintage",
    "pauper",
    "commander",
    "oathbreaker",
    "other",
  ]).notNull(),
  status: mysqlEnum("status", [
    "public",
    "limited",
    "private"
  ]).notNull(),
});

export const cardTable = mysqlTable("card", {
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
  cmc: int("cmc"),
  count: int("count").notNull(),
  board: mysqlEnum([
    "main",
    "side",
    "commander",
    "considering",
  ]).default("main").notNull(),
}, (table) => ({
  uniqueDeckCard: uniqueIndex("unique_deck_oracle_board").on(
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
