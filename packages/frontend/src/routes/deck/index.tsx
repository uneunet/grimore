import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deck/')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return <div>Hello "/decks/"!</div>
}
