import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const pocketDevPath = join(process.cwd(), 'src/features/pocket-dev')
const pageModulesPath = join(pocketDevPath, 'pages')
const routePageImports = {
  'index.tsx': 'HomePage',
  'about.tsx': 'AboutPage',
  'work.tsx': 'WorkPage',
  'projects.tsx': 'ProjectsPage',
  'resume.tsx': 'ResumePage',
  'contact.tsx': 'ContactPage',
} as const

describe('Pocket Dev Page modules', () => {
  it('keeps each Pocket Dev Page in an individual module imported directly by its route', () => {
    const pageModuleNames = [...Object.values(routePageImports), 'RotatePage']

    for (const pageModuleName of pageModuleNames) {
      expect(existsSync(join(pageModulesPath, `${pageModuleName}.tsx`))).toBe(true)
    }

    expect(existsSync(join(pocketDevPath, 'Pages.tsx'))).toBe(false)

    for (const [routeFile, pageModuleName] of Object.entries(routePageImports)) {
      const routeModule = readFileSync(join(process.cwd(), 'src/routes', routeFile), 'utf8')

      expect(routeModule).toContain(`@/features/pocket-dev/pages/${pageModuleName}`)
    }
  })

  it('keeps feature-owned behavior in focused orchestration modules instead of the feature root', () => {
    const expectedOrchestrationModules = [
      'contact/contactTargets.ts',
      'hooks/useDeviceKeyboardControls.ts',
      'hooks/useMobileLandscape.ts',
      'navigation/lcdSelection.ts',
      'navigation/pageCatalog.ts',
      'orchestration/DeviceNavigationContext.tsx',
      'orchestration/PocketDevDevice.tsx',
      'sfx/deviceSfx.ts',
    ] as const
    const rootBehaviorModules = [
      'contactTargets.ts',
      'content',
      'Device.tsx',
      'device',
      'lcd',
      'lcdSelection.ts',
      'pageCatalog.ts',
      'resumeContent.ts',
      'types.ts',
    ] as const

    for (const modulePath of expectedOrchestrationModules) {
      expect(existsSync(join(pocketDevPath, modulePath))).toBe(true)
    }

    for (const modulePath of rootBehaviorModules) {
      expect(existsSync(join(pocketDevPath, modulePath))).toBe(false)
    }

    const rootRouteModule = readFileSync(join(process.cwd(), 'src/routes/__root.tsx'), 'utf8')

    expect(rootRouteModule).toContain(
      '@/features/pocket-dev/orchestration/PocketDevDevice',
    )
  })

  it('keeps repeated LCD Page content presentation in small reusable modules', () => {
    const presentationPath = join(pocketDevPath, 'pages/presentation')
    const expectedPresentationModules = [
      'LcdContentSection.tsx',
      'LcdEntryPanel.tsx',
      'LcdLabeledBlock.tsx',
      'LcdActionRowLink.tsx',
      'index.ts',
    ] as const

    for (const modulePath of expectedPresentationModules) {
      expect(existsSync(join(presentationPath, modulePath))).toBe(true)
    }

    const forbiddenDumpModules = [
      'PageContent.tsx',
      'Presentation.tsx',
      'contentPresentation.tsx',
    ] as const

    for (const modulePath of forbiddenDumpModules) {
      expect(existsSync(join(presentationPath, modulePath))).toBe(false)
    }

    const workPageModule = readFileSync(join(pageModulesPath, 'WorkPage.tsx'), 'utf8')
    const projectsPageModule = readFileSync(join(pageModulesPath, 'ProjectsPage.tsx'), 'utf8')
    const resumePageModule = readFileSync(join(pageModulesPath, 'ResumePage.tsx'), 'utf8')
    const contactPageModule = readFileSync(join(pageModulesPath, 'ContactPage.tsx'), 'utf8')

    expect(workPageModule).toContain('./presentation')
    expect(workPageModule).not.toContain('function WorkSection')
    expect(workPageModule).not.toContain('<LcdPanel as="article" className="work-entry"')
    expect(projectsPageModule).toContain('./presentation')
    expect(projectsPageModule).not.toContain('function ProjectCard')
    expect(resumePageModule).toContain('./presentation')
    expect(resumePageModule).not.toContain('className="resume-preview-section"')
    expect(contactPageModule).toContain('./presentation')
    expect(contactPageModule).not.toContain('<span>{contactTarget.label}</span>')
  })
})
