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
})
