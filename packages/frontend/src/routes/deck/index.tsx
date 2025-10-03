import { createFileRoute, Link } from '@tanstack/react-router'

import type { AppType } from '@grimore/backend'
import { hc } from 'hono/client'

export const Route = createFileRoute('/deck/')({
  component: RouteComponent,
  loader: async () => {
    const client = hc<AppType>("/");
    const res = await client.api.deck.$get({
      query: {
      }
    });

    if (!res.ok) {
      throw new Error("API Error");
    }

    return await res.json();
  }
})

function RouteComponent() {
  const decks = Route.useLoaderData();

  return (
    <>
      { decks.map((d) => 
        <div>
          <Link
            to='/deck/$deckId'
            params={{ deckId: d.id }}
          >{d.name}</Link>
        </div>
      ) }
    </>
  )
}
