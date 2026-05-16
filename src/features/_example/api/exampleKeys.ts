export const exampleKeys = {
  all: ['examples'] as const,
  list: () => [...exampleKeys.all, 'list'] as const,
  detail: (id: number) => [...exampleKeys.all, 'detail', id] as const,
}
