import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/decks/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/decks/search"!</div>
}
