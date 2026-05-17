import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const pocketDevPath = join(process.cwd(), 'src/features/pocket-dev')
const pageModulesPath = join(pocketDevPath, 'pages')
const pageModuleNames = [
  'HomePage',
  'AboutPage',
  'WorkPage',
  'ProjectsPage',
  'ResumePage',
  'ContactPage',
  'RotatePage',
] as const

describe('Pocket Dev Page modules', () => {
  it('keeps each Pocket Dev Page in an individual module imported directly by its route', () => {
    for (const pageModuleName of pageModuleNames) {
      expect(existsSync(join(pageModulesPath, `${pageModuleName}.tsx`))).toBe(true)
    }

    const combinedPagesModule = readFileSync(join(pocketDevPath, 'Pages.tsx'), 'utf8')

    expect(combinedPagesModule).not.toMatch(/export function \w+Page/)

    const routeImports = {
      'index.tsx': '@/features/pocket-dev/pages/HomePage',
      'about.tsx': '@/features/pocket-dev/pages/AboutPage',
      'work.tsx': '@/features/pocket-dev/pages/WorkPage',
      'projects.tsx': '@/features/pocket-dev/pages/ProjectsPage',
      'resume.tsx': '@/features/pocket-dev/pages/ResumePage',
      'contact.tsx': '@/features/pocket-dev/pages/ContactPage',
    } as const

    for (const [routeFile, pageImport] of Object.entries(routeImports)) {
      const routeModule = readFileSync(join(process.cwd(), 'src/routes', routeFile), 'utf8')

      expect(routeModule).toContain(pageImport)
    }
  })
})
