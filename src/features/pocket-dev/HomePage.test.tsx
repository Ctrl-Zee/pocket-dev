import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { routeTree } from '@/routeTree.gen'

const expectedHomeMenuItems = ['About', 'Work', 'Projects', 'Resume', 'Contact']
const expectedHomeMenuHrefs = ['/about', '/work', '/projects', '/resume', '/contact']
const expectedRoutedPages = [
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
  const user = userEvent.setup()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
    defaultPreloadStaleTime: 0,
  })

  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { router, user, ...view }
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

  it('navigates to the selected LCD Page when a Home menu row is clicked', async () => {
    const { router, user } = renderRoute('/')

    await user.click(await screen.findByRole('link', { name: 'Projects' }))

    expect(router.state.location.pathname).toBe('/projects')
    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('returns from a top-level LCD Page to Home when B is pressed', async () => {
    const { router, user } = renderRoute('/work')

    await user.click(await screen.findByRole('button', { name: /b/i }))

    expect(router.state.location.pathname).toBe('/')
    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /home/i })).toBeInTheDocument()
  })

  it('moves the Home selection with keyboard controls and activates it with Enter', async () => {
    const { router, user } = renderRoute('/')

    await screen.findByRole('heading', { name: /home/i })
    await user.keyboard('{ArrowDown}{Enter}')

    expect(router.state.location.pathname).toBe('/work')
    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /work/i })).toBeInTheDocument()
  })

  it('moves the Home selection with the D-pad and activates it with A', async () => {
    const { router, user } = renderRoute('/')

    await screen.findByRole('heading', { name: /home/i })
    await user.click(screen.getByRole('button', { name: /down/i }))
    await user.click(screen.getByRole('button', { name: /down/i }))
    await user.click(screen.getByRole('button', { name: /^a$/i }))

    expect(router.state.location.pathname).toBe('/projects')
    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })
})

describe('About route', () => {
  it('renders factual identity, location, bio, and personal details inside the LCD', async () => {
    renderRoute('/about')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    expect(within(lcd).getByRole('heading', { name: /about/i })).toBeInTheDocument()
    expect(
      within(lcd).getByRole('heading', {
        name: /andrew smith \/ software engineer/i,
      }),
    ).toBeInTheDocument()
    expect(within(lcd).getByText(/indianapolis, indiana/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/^software engineer and senior consultant/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/board games/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/biking/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/reading/i)).toBeInTheDocument()
    expect(
      within(lcd).queryByText(/department of local government finance/i),
    ).not.toBeInTheDocument()
  })
})
