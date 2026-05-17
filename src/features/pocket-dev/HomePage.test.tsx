import { render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { routeTree } from '../../routeTree.gen'

function renderRoute(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
    defaultPreloadStaleTime: 0,
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('Home route', () => {
  it('renders the Home Page inside the Pocket Dev experience at /', async () => {
    renderRoute('/')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    expect(device).toBeInTheDocument()

    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /home/i })).toBeInTheDocument()

    const menuItems = within(lcd).getAllByRole('link').map((link) => link.textContent)
    expect(menuItems).toEqual(['About', 'Work', 'Projects', 'Resume', 'Contact'])

    expect(screen.getByLabelText(/pocket dev wordmark/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/power led/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/volume wheel/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/d-pad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/a and b buttons/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/select and start buttons/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/speaker grill/i)).toBeInTheDocument()

    const controlHint = screen.getByText(/arrows move \/ enter a \/ esc b/i)
    expect(controlHint).toBeInTheDocument()
    expect(device).not.toContainElement(controlHint)
  })
})
