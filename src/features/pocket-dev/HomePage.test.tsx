import { render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
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

describe('Projects route', () => {
  it('renders resume-derived professional project cards inside the LCD', async () => {
    renderRoute('/projects')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    const projectCards = within(lcd).getAllByRole('article')

    expect(projectCards).toHaveLength(4)
    expect(within(lcd).getByRole('heading', { name: /projects/i })).toBeInTheDocument()

    expect(projectCards[0]).toHaveTextContent(/benesys/i)
    expect(projectCards[0]).toHaveTextContent(/react/i)
    expect(projectCards[0]).toHaveTextContent(/zustand/i)
    expect(projectCards[0]).toHaveTextContent(/tanstack query/i)
    expect(projectCards[0]).toHaveTextContent(/react hook form/i)
    expect(projectCards[0]).toHaveTextContent(/tailwind/i)

    expect(projectCards[1]).toHaveTextContent(/family and social services administration \/ pebt/i)
    expect(projectCards[1]).toHaveTextContent(/angular 15/i)
    expect(projectCards[1]).toHaveTextContent(/typescript/i)
    expect(projectCards[1]).toHaveTextContent(/ngrx component store/i)

    expect(projectCards[2]).toHaveTextContent(/schwarz partners/i)
    expect(projectCards[2]).toHaveTextContent(/angular/i)
    expect(projectCards[2]).toHaveTextContent(/azure ad b2c/i)
    expect(projectCards[2]).toHaveTextContent(/\.net/i)
    expect(projectCards[2]).toHaveTextContent(/c#/i)
    expect(projectCards[2]).toHaveTextContent(/sql server/i)
    expect(projectCards[2]).toHaveTextContent(/product key management/i)

    expect(projectCards[3]).toHaveTextContent(/venture logistics/i)
    expect(projectCards[3]).toHaveTextContent(/angular/i)
    expect(projectCards[3]).toHaveTextContent(/\.net/i)
    expect(projectCards[3]).toHaveTextContent(/c#/i)
    expect(projectCards[3]).toHaveTextContent(/signalr/i)

    expect(within(lcd).queryByText(/placeholder/i)).not.toBeInTheDocument()
  })
})
