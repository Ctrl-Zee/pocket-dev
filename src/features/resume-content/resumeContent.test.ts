import { resumeContent } from './resumeContent'

const searchableResumeContent = () => JSON.stringify(resumeContent).toLowerCase()

describe('resumeContent', () => {
  it('exports curated factual resume data for Pocket Dev pages', () => {
    const content = searchableResumeContent()

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
      ]),
    )

    for (const skill of [
      'React',
      'Angular',
      'JavaScript',
      'Responsive Web Design',
      '.NET',
      'Azure',
    ]) {
      expect(resumeContent.skills).toContainEqual(
        expect.objectContaining({ name: skill }),
      )
    }

    expect(content).toContain('moser consulting')
    expect(content).toContain('senior consultant')
    expect(content).toContain('department of local government finance')

    expect(resumeContent.projects.map((project) => project.name)).toEqual(
      expect.arrayContaining([
        'Benesys',
        'Family and Social Services Administration / PEBT',
        'Schwarz Partners',
        'Venture Logistics',
      ]),
    )

    expect(content).toContain('bs computer science')
    expect(content).toContain('iupui')
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
      expect.arrayContaining([
        'project one',
        'project two',
        'project three',
        'placeholder',
        'todo',
      ]),
    )
  })
})
