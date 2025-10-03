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

export const FormatNames = {
  standard: "スタンダード",
  pioneer: "パイオニア",
  modern: "モダン",
  legacy: "レガシー",
  vintage: "ヴィンテージ",
  pauper: "パウパー",
  commander: "統率者戦",
  oathbreaker: "オースブレイカー",
  other: "その他",
} as const;

export const Board = z.enum([
  "main",
  "side",
  "commander",
  "considering",
]);

export const BoardNames = {
  main: "メインボード",
  side: "サイドボード",
  commander: "統率領域",
  considering: "検討中",
} as const;

export const Status = z.enum([
  "public",
  "limited",
  "private",
]);

export const StatusNames = {
  public: "公開",
  limited: "限定公開",
  private: "非公開",
} as const;

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
  imageUri: z.url().optional(),
  name: z.string(),
  cardType: z.string(),
  cmc: z.int(),
  count: z.int(),
  board: Board,
});
