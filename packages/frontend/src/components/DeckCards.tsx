import { MtgCard } from "@/components/MtgCard";

export function DeckCards({ cards }) {
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,103px)] justify-center gap-2">
        { cards.map((card) => <MtgCard name={card.name} imageUri={card.imageUri} amounts={card.amounts} />) }
      </div>
    </>
  );
}
