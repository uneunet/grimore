import type { AppType } from '@grimore/backend';
import { hc } from 'hono/client';

import { createFileRoute } from '@tanstack/react-router'

import { Separator } from '@/components/ui/separator';
import { Search } from '@/components/Search';
import { Deck } from '@/components/Deck';

import { DeckHeader } from '@/components/DeckHeader';
import { useQuery } from '@tanstack/react-query';
import { QUERYKEYS } from '@/lib/types';

export const Route = createFileRoute('/deck/$deckId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { deckId } = Route.useParams();

  const { isPending, error, data } = useQuery({
    queryKey: [QUERYKEYS.deck, deckId],
    queryFn: async () => {
      const client = hc<AppType>("/");
      const res = await client.api.deck[':id'].$get({
        param: {
          id: deckId,
        }
      });

      if (!res.ok) {
        throw new Error("API Error");
      }
      
      return await res.json();
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <DeckHeader deckId={deckId} name={data?.name} format={data?.format} status={data?.status} />
      <Separator />

      <Search deckId={deckId} format={data?.format} />
      <Separator />

      <Deck deckId={deckId} deck={data?.card} />
    </div>
  )
}
