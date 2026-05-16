import { useExamplesQuery } from '../api/exampleQueries'
import type { ExampleItem } from '../types/ExampleTypes'

interface ExampleListItemProps {
  item: ExampleItem
}

function ExampleListItem({ item }: ExampleListItemProps) {
  return (
    <li>
      {item.name} — {item.status}
    </li>
  )
}

export function ExampleList() {
  const { data: examples, isLoading } = useExamplesQuery()

  if (isLoading) return <p>Loading...</p>

  return (
    <ul>
      {examples?.map((item) => (
        <ExampleListItem key={item.id} item={item} />
      ))}
    </ul>
  )
}
