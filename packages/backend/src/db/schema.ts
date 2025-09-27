import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ulid } from 'ulid';

export const deck = sqliteTable('deck', {
  id: text("id").primaryKey().$defaultFn(ulid),
  createdAt: integer("created_at", { mode: 'timestamp' })
    .$default(() => new Date()),
  updateAt: integer("update_at", { mode: 'timestamp' })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  format: text("format").notNull(),
  status: text("status").notNull(),
});


export const deckCards = sqliteTable('deckCards', {
  id: text("id").primaryKey().$defaultFn(ulid),
  createdAt: integer("created_at", { mode: 'timestamp' })
    .$default(() => new Date()),
  updateAt: integer("update_at", { mode: 'timestamp' })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
  deckId: text("deck_id").references(() => deck.id, { onDelete: "cascade" }),
  oracleId: text("oracle_id").notNull(),
  imageUri: text("image_uri").notNull(),
  name: text("name").notNull(),
  cardType: text("card_type").notNull(),
  cmc: integer("cmc").notNull(),
  amounts: integer("amounts").notNull(),
  board: text("board").notNull(),
});

