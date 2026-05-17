import { render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { routeTree } from '@/routeTree.gen'

const expectedHomeMenuItems = ['About', 'Work', 'Projects', 'Resume', 'Contact']
const expectedHomeMenuHrefs = ['/about', '/work', '/projects', '/resume', '/contact']
const expectedRoutedPages = [
  { path: '/about', heading: /about/i, content: /andrew smith/i },
  { path: '/work', heading: /work/i, content: /experience/i },
  { path: '/projects', heading: /projects/i, content: /selected projects/i },
  { path: '/resume', heading: /resume/i, content: /formal resume/i },
  { path: '/contact', heading: /contact/i, content: /contact links/i },
] as const
const hardwareLabels = [
  /pocket dev wordmark/i,
  /power led/i,
  /volume wheel/i,
  /d-pad/i,
  /a and b buttons/i,
  /select and start buttons/i,
  /speaker grill/i,
]

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

    const menuLinks = within(lcd).getAllByRole('link')
    expect(menuLinks.map((link) => link.textContent)).toEqual(expectedHomeMenuItems)
    expect(menuLinks.map((link) => link.getAttribute('href'))).toEqual(expectedHomeMenuHrefs)

    hardwareLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    })

    const controlHint = screen.getByText(/arrows move \/ enter a \/ esc b/i)
    expect(controlHint).toBeInTheDocument()
    expect(device).not.toContainElement(controlHint)
  })

  it.each(expectedRoutedPages)(
    'renders the $path LCD Page inside the constant Pocket Dev Device',
    async ({ path, heading, content }) => {
      renderRoute(path)

      const device = await screen.findByRole('main', { name: /pocket dev device/i })
      const lcd = within(device).getByRole('region', { name: /lcd screen/i })

      expect(within(lcd).getByRole('heading', { name: heading })).toBeInTheDocument()
      expect(within(lcd).getByText(content)).toBeInTheDocument()

      hardwareLabels.forEach((label) => {
        expect(screen.getByLabelText(label)).toBeInTheDocument()
      })
    },
  )
})
