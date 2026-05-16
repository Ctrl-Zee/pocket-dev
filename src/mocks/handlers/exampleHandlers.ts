import { http, HttpResponse } from 'msw'
import type { ExampleItem } from '../../features/_example/types/ExampleTypes'

const items: ExampleItem[] = [
  { id: 1, name: 'First item', status: 'active' },
  { id: 2, name: 'Second item', status: 'completed' },
]

export const exampleHandlers = [
  http.get('*/examples', () => {
    return HttpResponse.json(items)
  }),

  http.post('*/examples', async ({ request }) => {
    const body = (await request.json()) as Omit<ExampleItem, 'id'>
    const newItem: ExampleItem = { ...body, id: items.length + 1 }
    items.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),
]
