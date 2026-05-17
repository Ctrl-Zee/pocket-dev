import { resumeContent, type ProjectEntry } from './resumeContent'

const expectedSkillNames = [
  'React',
  'Angular',
  'JavaScript',
  'Responsive Web Design',
  '.NET',
  'Azure',
]

const expectedProjectNames = [
  'Benesys',
  'Family and Social Services Administration / PEBT',
  'Schwarz Partners',
  'Venture Logistics',
]

const placeholderProjectNames = [
  'project one',
  'project two',
  'project three',
  'placeholder',
  'todo',
]

function getProjectByName(projectName: string): ProjectEntry {
  const project = resumeContent.projects.find(
    ({ name }) => name === projectName,
  )

  expect(project).toBeDefined()

  if (!project) {
    throw new Error(`Expected project "${projectName}" to exist.`)
  }

  return project
}

describe('resumeContent', () => {
  it('exports curated factual resume data for Pocket Dev pages', () => {
    const searchableContent = JSON.stringify(resumeContent).toLowerCase()

    expect(resumeContent.identity.name).toBe('Andrew Smith')
    expect(resumeContent.identity.publicTitle).toBe('Software Engineer')
    expect(resumeContent.identity.location).toContain('Indianapolis')

    expect(resumeContent.contactTargets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Email',
          href: 'mailto:andrew.smith.indy@gmail.com',
        }),
        expect.objectContaining({
          label: 'LinkedIn',
        }),
        expect.objectContaining({
          label: 'Website',
          href: expect.stringContaining('andrewsmith.bio'),
        }),
        expect.objectContaining({
          label: 'Phone',
          href: 'tel:+13172608411',
        }),
      ]),
    )

    for (const skill of expectedSkillNames) {
      expect(resumeContent.skills).toContainEqual(
        expect.objectContaining({ name: skill }),
      )
    }

    expect(searchableContent).toContain('moser consulting')
    expect(searchableContent).toContain('senior consultant')
    expect(searchableContent).toContain('department of local government finance')

    expect(resumeContent.projects.map((project) => project.name)).toEqual(
      expect.arrayContaining(expectedProjectNames),
    )

    expect(searchableContent).toContain('bs computer science')
    expect(searchableContent).toContain('iupui')
    expect(resumeContent.activities).toEqual([
      'Board Games',
      'Biking',
      'Reading',
    ])
  })

  it('does not expose placeholder project names', () => {
    const projectNames = resumeContent.projects.map((project) =>
      project.name.toLowerCase(),
    )

    expect(projectNames).not.toEqual(
      expect.arrayContaining(placeholderProjectNames),
    )
  })

  it('keeps Software Engineer as the public identity copy', () => {
    expect(resumeContent.identity.publicTitle).toBe('Software Engineer')
    expect(resumeContent.identity.summary).toMatch(/^Software Engineer\b/)
  })

  it('keeps the public-sector PEBT scale fact with the project entry', () => {
    const pebtProject = getProjectByName(
      'Family and Social Services Administration / PEBT',
    )

    expect(pebtProject.highlights).toContain('Served 20K families.')
  })

  it('keeps the Benesys enterprise scale fact with the project entry', () => {
    const benesysProject = getProjectByName('Benesys')

    expect(benesysProject.highlights).toContain('Supported 100+ clients.')
  })
})
