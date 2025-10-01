import * as z from "zod";

export const Format = z.enum([
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

export const Board = z.enum([
  "main",
  "side",
  "commander",
  "considering",
]);

export const Status = z.enum([
  "public",
  "limited",
  "private",
]);

export const Deck = z.object({
  id: z.ulid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  name: z.string(),
  format: Format, 
  status: Status,
});

export const Card = z.object({
  id: z.ulid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deckId: z.string(),
  oracleId: z.string(),
  imageUri: z.string().optional(),
  name: z.string(),
  cardType: z.string(),
  cmc: z.int(),
  count: z.int(),
  board: Board,
});

