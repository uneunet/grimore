export type CardType = 
  "land"
| "creature"
| "enchant"
| "artifact" 
| "instant"
| "sorcery"
| "planeswalker"
| "battle";

export type Format =
  "standard"
| "pioneer"
| "modern"
| "legacy"
| "vintage"
| "pauper"
| "commander"
| "oathbreaker";

export type Board =
  "mainboard"
| "sideboard"
| "commander"
| "considering";

export type Status =
  "public"
| "limited"
| "private";


export interface Deck {
  id: string,
  createdAt: Date,
  updateAt: Date,
  userId: string,
  name: string,
  format: Format,
  status: Status,
}

export interface DeckCards {
  id: string,
  createdAt: Date,
  updateAt: Date,
  deckId: string,
  oracleId: string,
  imageUri: string,
  name: string,
  cardType: string,
  cmc: number,
  amounts: number,
  board: Board,
}

