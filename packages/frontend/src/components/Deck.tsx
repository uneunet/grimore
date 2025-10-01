import { useMutation } from "@tanstack/react-query";
import { DeckCards } from "@/components//DeckCards";
import { countCards } from "@/lib/utils";

export function Deck({ deckId }: { deckId: string }) {
  const deck = [
    {
      oracleId: "d412b175-2365-4b2c-a8f5-3e4e9d06280d",
      imageUri: "https://cards.scryfall.io/small/front/0/c/0c90e4e7-a60c-479b-93ae-5209761b7c7c.jpg?1733252755",
      name: "遺跡ガニ",
      cardType: "Creature",
      amounts: 4,
      board: "mainboard",
      cmc: "1.0"
    },
    {
      oracleId: "d412b175-2365-4b2c-a8f5-3e4e9d06280d",
      imageUri: "https://cards.scryfall.io/small/front/c/5/c5fb50d5-185f-4e01-b726-7faf6d0514a5.jpg?1619739154",
      name: "書庫の罠",
      cardType: "Instant - Trap",
      amounts: 4,
      board: "mainboard",
      cmc: "5.0"
    },
    {
      oracleId: "d412b175-2365-4b2c-a8f5-3e4e9d06280d",
      imageUri: "https://cards.scryfall.io/small/front/c/5/c5fb50d5-185f-4e01-b726-7faf6d0514a5.jpg?1619739154",
      name: "書庫の罠",
      cardType: "Instant - trap",
      amounts: 4,
      board: "sideboard",
      cmc: "5.0"
    },
  ];

  const mainBoard = deck.filter((c) => c.board === "mainboard");
  // const creatures = deck.filter((c) => !c.cardType.includes("Land") && c.cardType.includes("Creature"));
  // const spells = deck.filter((c) => !c.cardType.includes("Land") && !c.cardType.includes("Creature"));
  // const lands = deck.filter((c) => c.cardType.includes("Land"));

  const sideBoard = deck.filter((c) => c.board === "sideboard");
  const considering = deck.filter((c) => c.board === "considering");

  return (
    <div className="mx-2">
      <div className="my-4">
        <h1 className="text-2xl font-bold">メインボード ({countCards(mainBoard)})</h1>
        <DeckCards cards={mainBoard} />
      </div>

      <div className="my-4">
        <h1 className="text-2xl font-bold">サイドボード ({countCards(sideBoard)})</h1>
        <DeckCards cards={sideBoard} />
      </div>


      <div className="my-4">
        <h1 className="text-2xl font-bold">検討中 ({countCards(considering)})</h1>
        <DeckCards cards={considering} />
      </div>
    </div>
  );
}
