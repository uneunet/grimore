import { useMutation } from "@tanstack/react-query";

import * as z from "zod";

import { Schema } from "@grimore/shared";
import { DeckCards } from "@/components//DeckCards";
import { countCards } from "@/lib/utils";

export function Deck({ deckId, deck }: { deckId: string, deck: any | undefined }) {
  const safeDeck = deck ?? [];

  const mainBoard = safeDeck.filter((c) => c.board === "main");
  // const creatures = deck.filter((c) => !c.cardType.includes("Land") && c.cardType.includes("Creature"));
  // const spells = deck.filter((c) => !c.cardType.includes("Land") && !c.cardType.includes("Creature"));
  // const lands = deck.filter((c) => c.cardType.includes("Land"));

  const sideBoard = safeDeck.filter((c) => c.board === "side");
  const considering = safeDeck.filter((c) => c.board === "considering");

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
