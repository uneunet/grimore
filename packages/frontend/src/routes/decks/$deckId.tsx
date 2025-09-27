import { createFileRoute } from '@tanstack/react-router'

import { Separator } from '@/components/ui/separator';
import { Search } from '@/components/Search';
import { Deck } from '@/components/Deck';

import { DeckHeader } from '@/components/DeckHeader';

export const Route = createFileRoute('/decks/$deckId')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-2">
      <DeckHeader deckId={"aaa"} />
      <Separator />

      <Search deckId={"aaa"} />
      <Separator />

      <Deck deckId={"aaa"} />
    </div>
  )
}
