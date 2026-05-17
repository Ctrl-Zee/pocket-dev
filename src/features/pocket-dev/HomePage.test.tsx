import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
const mobileLandscapeQuery = '(max-width: 900px) and (orientation: landscape)'
const pocketDevCss = readFileSync(
  join(process.cwd(), 'src/features/pocket-dev/pocket-dev.css'),
  'utf8',
)

function mockMobileLandscapeQuery(matches: boolean) {
  const mediaQueryList = {
    matches,
    media: mobileLandscapeQuery,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryList))
}

function getExpectedContactWindowTarget(href: string) {
  return href.startsWith('mailto:') || href.startsWith('tel:') ? '_self' : '_blank'
}

function renderRoute(path: string) {
  const user = userEvent.setup()
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    defaultPreloadStaleTime: 0,
  })

  const view = render(<RouterProvider router={router} />)

  return { router, user, ...view }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

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

  it('shows the rotate-back Page inside the LCD on mobile landscape', async () => {
    mockMobileLandscapeQuery(true)

    renderRoute('/work')

    const device = await screen.findByRole('main', { name: /pocket dev device/i })
    const lcd = within(device).getByRole('region', { name: /lcd screen/i })

    expect(within(lcd).getByRole('heading', { name: /rotate/i })).toBeInTheDocument()
    expect(within(lcd).getByText(/please rotate your device/i)).toBeInTheDocument()
    expect(within(lcd).queryByRole('region', { name: /work details/i })).not.toBeInTheDocument()
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
      getExpectedContactWindowTarget(resumeContent.contactTargets[1].href),
      'noreferrer',
    )
  })

  it('resets Contact LCD selection to the first actionable row when re-entering the Page', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { user } = renderRoute('/contact')

    await screen.findByRole('heading', { name: /contact/i })
    await user.click(screen.getByRole('button', { name: /down/i }))
    await user.click(screen.getByRole('button', { name: /b/i }))
    await user.click(await screen.findByRole('link', { name: 'Contact' }))
    await user.click(screen.getByRole('button', { name: /^a$/i }))

    expect(openSpy).toHaveBeenCalledWith(
      resumeContent.contactTargets[0].href,
      getExpectedContactWindowTarget(resumeContent.contactTargets[0].href),
      'noreferrer',
    )
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

describe('Pocket Dev responsive styles', () => {
  it('uses a larger readable LCD typography scale while preserving the pixel font', () => {
    expect(pocketDevCss).toContain("--font-pixel: 'Press Start 2P', monospace;")
    expect(pocketDevCss).toContain('--lcd-title-text: 11px;')
    expect(pocketDevCss).toContain('--lcd-body-text: 9px;')
    expect(pocketDevCss).toContain('--lcd-menu-text: 9px;')
    expect(pocketDevCss).toContain('--lcd-supporting-text: 8px;')
    expect(pocketDevCss).toContain('--lcd-footer-text: 7px;')

    expect(pocketDevCss).toMatch(/\.lcd-screen\s*{[^}]*font-family:\s*var\(--font-pixel\);/s)
    expect(pocketDevCss).toMatch(/\.lcd-title\s*{[^}]*font-size:\s*var\(--lcd-title-text\);/s)
    expect(pocketDevCss).toMatch(/\.lcd-page p,\s*\.lcd-page li\s*{[^}]*font-size:\s*var\(--lcd-body-text\);/s)
    expect(pocketDevCss).toMatch(/\.home-menu a\s*{[^}]*font-size:\s*var\(--lcd-menu-text\);/s)
    expect(pocketDevCss).toMatch(/\.project-card p\s*{[^}]*font-size:\s*var\(--lcd-supporting-text\);/s)
    expect(pocketDevCss).toMatch(/\.lcd-footer\s*{[^}]*font-size:\s*var\(--lcd-footer-text\);/s)
  })

  it('scales the desktop Device above the original handheld size while keeping viewport bounds', () => {
    const desktopDeviceRule = pocketDevCss.match(/\.pocket-dev-device\s*{[^}]*}/s)?.[0]

    expect(desktopDeviceRule).toContain('width: min(94vw, 500px);')
    expect(desktopDeviceRule).toContain('height: min(96dvh, 780px);')
  })

  it('keeps mobile portrait in the viewport and removes decorative motion when requested', () => {
    expect(pocketDevCss).toMatch(/body\s*{[^}]*overflow:\s*hidden;/s)
    expect(pocketDevCss).toMatch(
      /@media\s*\(max-width:\s*480px\)\s*and\s*\(orientation:\s*portrait\)\s*{[\s\S]*\.pocket-dev-device\s*{[^}]*min-height:\s*0;[^}]*height:\s*calc\(100dvh - 54px\);/s,
    )
    expect(pocketDevCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*{[\s\S]*\.power-led,\s*\.lcd-screen::after,\s*\.home-menu a\.is-selected::before\s*{[^}]*animation:\s*none;/s,
    )
  })
})
