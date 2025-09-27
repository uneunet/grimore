import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { CardType, Format } from "shared/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractImageUris(card: any): string {
  if ("image_uris" in card) {
    return card.image_uris.small;
  }

  return card.card_faces[0].image_uris.small;
}

export function buildScryfallQuery({ name, format, cardTypes }: { name?: string, format?: Format, cardTypes?: [CardType] }): string {
  const nameQuery = name ?? "";
  const formatQuery = format as string ?? "";
  const cardTypesQuery = cardTypes?.map((s: string) => `t:${s}`).join(" ") ?? "";

  const query = [nameQuery, formatQuery, cardTypesQuery].filter((s: string) => s !== "").join(" ");
  return query;
}

export function countCards(cards): number {
  return cards.reduce(
    (acc, c) => acc + c.amounts,
    0,
  );
}
