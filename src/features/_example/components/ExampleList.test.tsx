import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { server } from '../../../mocks/server'
import { ExampleList } from './ExampleList'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('ExampleList', () => {
  it('renders loading state', () => {
    renderWithProviders(<ExampleList />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders items after loading', async () => {
    renderWithProviders(<ExampleList />)
    expect(await screen.findByText(/First item/)).toBeInTheDocument()
    expect(screen.getByText(/Second item/)).toBeInTheDocument()
  })
})
