import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import { resumeContent } from '@/features/resume-content/resumeContent'
import { routeTree } from '@/routeTree.gen'

const expectedHomeMenuItems = ['About', 'Work', 'Projects', 'Resume', 'Contact']
const expectedHomeMenuHrefs = ['/about', '/work', '/projects', '/resume', '/contact']
const expectedWorkContent = [
  /senior consultant/i,
  /moser consulting/i,
  /department of local government finance/i,
  /react/i,
  /angular/i,
  /javascript/i,
  /responsive web design/i,
  /\.net/i,
  /azure/i,
  /cross-functional teams/i,
  /bs computer science/i,
  /iupui/i,
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

  it('navigates to the selected LCD Page when a Home menu row is clicked', async () => {
    const { router, user } = renderRoute('/')

    await user.click(await screen.findByRole('link', { name: 'Projects' }))

    expect(router.state.location.pathname).toBe('/projects')
    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(await within(lcd).findByRole('heading', { name: /projects/i })).toBeInTheDocument()
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

describe('Contact route', () => {
  it('renders direct Contact links and opens the selected target with A', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { user } = renderRoute('/contact')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    expect(within(lcd).getByRole('heading', { name: /contact/i })).toBeInTheDocument()

    for (const contactTarget of resumeContent.contactTargets) {
      const contactLink = within(lcd).getByRole('link', {
        name: new RegExp(contactTarget.label, 'i'),
      })

      expect(contactLink).toHaveAttribute('href', contactTarget.href)
      expect(contactLink).toHaveTextContent(contactTarget.value)
    }

    await user.click(screen.getByRole('button', { name: /down/i }))
    await user.click(screen.getByRole('button', { name: /^a$/i }))

    expect(openSpy).toHaveBeenCalledWith(
      resumeContent.contactTargets[1].href,
      resumeContent.contactTargets[1].href?.startsWith('mailto:') ? '_self' : '_blank',
      'noreferrer',
    )

    openSpy.mockRestore()
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

describe('Work route', () => {
  it('renders factual Work content inside a scrollable LCD Page', async () => {
    renderRoute('/work')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    expect(within(lcd).getByRole('heading', { name: /work/i })).toBeInTheDocument()

    const workPane = within(lcd).getByRole('region', { name: /work details/i })
    expectedWorkContent.forEach((content) => {
      expect(within(workPane).getAllByText(content).length).toBeGreaterThan(0)
    })
  })
})

describe('Projects route', () => {
  it('renders resume-derived professional project cards inside the LCD', async () => {
    renderRoute('/projects')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    const projectCards = within(lcd).getAllByRole('article')

    expect(projectCards).toHaveLength(resumeContent.projects.length)
    expect(within(lcd).getByRole('heading', { name: /projects/i })).toBeInTheDocument()

    resumeContent.projects.forEach((project, index) => {
      const projectCard = projectCards[index]

      expect(within(projectCard).getByRole('heading', { name: project.name })).toBeInTheDocument()
      expect(projectCard).toHaveTextContent(project.summary)
      expect(projectCard).toHaveTextContent(`Stack: ${project.stack.join(' / ')}`)
    })

    expect(within(lcd).queryByText(/placeholder/i)).not.toBeInTheDocument()
  })
})

describe('Resume route', () => {
  it('renders a compact Resume Page with an Open PDF action', async () => {
    renderRoute('/resume')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    expect(within(lcd).getByRole('heading', { name: /resume/i })).toBeInTheDocument()
    expect(within(lcd).getByText(/andrew smith/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/^software engineer$/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/indianapolis, indiana/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/react \/ angular \/ javascript/i)).toBeInTheDocument()
    expect(within(lcd).getByText(/responsive web design \/ \.net \/ azure/i)).toBeInTheDocument()

    const openPdfLink = within(lcd).getByRole('link', { name: /open pdf/i })
    expect(openPdfLink).toHaveAttribute('href', '/assets/Andrew_Smith_Resume.pdf')
    expect(openPdfLink).toHaveAttribute('target', '_blank')
    expect(openPdfLink).toHaveAttribute('rel', 'noreferrer')
    expect(openPdfLink).not.toHaveAttribute('download')
  })
})
