import { resumeContent, type ProjectEntry, type ResumeContent } from './resumeContent'

const requiredSkillNames = [
  'React',
  'Angular',
  'JavaScript',
  'Responsive Web Design',
  '.NET',
  'Azure',
]

const requiredProjectNames = [
  'Benesys',
  'Family and Social Services Administration / PEBT',
  'Schwarz Partners',
  'Venture Logistics',
]

const forbiddenPlaceholderProjectNames = [
  'project one',
  'project two',
  'project three',
  'placeholder',
  'todo',
]

const expectedContactTargets = [
  {
    label: 'Email',
    value: 'andrew.smith.indy@gmail.com',
    href: 'mailto:andrew.smith.indy@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'andrew-smith-aa763164',
    href: 'https://www.linkedin.com/in/andrew-smith-aa763164/',
  },
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

describe('resumeContent module', () => {
  it('exports curated resume content from the content tree', () => {
    const curatedResumeContent: ResumeContent = resumeContent

    expect(curatedResumeContent.identity.name).toBe('Andrew Smith')
    expect(curatedResumeContent.projects.length).toBeGreaterThan(0)
  })
})

describe('resumeContent', () => {
  it('exports curated factual resume data for Pocket Dev pages', () => {
    const searchableContent = JSON.stringify(resumeContent).toLowerCase()

    expect(resumeContent.identity.name).toBe('Andrew Smith')
    expect(resumeContent.identity.publicTitle).toBe('Software Engineer')
    expect(resumeContent.identity.location).toContain('Indianapolis')

    expect(resumeContent.contactTargets).toEqual(expectedContactTargets)

    for (const skill of requiredSkillNames) {
      expect(resumeContent.skills).toContainEqual(
        expect.objectContaining({ name: skill }),
      )
    }

    expect(searchableContent).toContain('moser consulting')
    expect(searchableContent).toContain('senior consultant')
    expect(searchableContent).toContain('department of local government finance')

    expect(resumeContent.projects.map((project) => project.name)).toEqual(
      expect.arrayContaining(requiredProjectNames),
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
      expect.arrayContaining(forbiddenPlaceholderProjectNames),
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
