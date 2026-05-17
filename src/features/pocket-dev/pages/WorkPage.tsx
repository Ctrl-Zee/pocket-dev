import { LcdPage, LcdScrollableArea } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'
import { LcdContentSection, LcdEntryPanel } from './presentation'

const workExperienceHighlightLimit = 3
const workSoftCompetencyLimit = 4

export function WorkPage() {
  return (
    <LcdPage title="Work">
      <WorkDetails />
    </LcdPage>
  )
}

function WorkDetails() {
  return (
    <LcdScrollableArea className="work-page" role="region" aria-label="Work details">
      <LcdContentSection headingId="work-experience-heading" title="Experience">
        {resumeContent.experience.map((entry) => (
          <LcdEntryPanel
            className="work-entry"
            key={`${entry.employer}-${entry.role}`}
            kicker={`${entry.startYear}-${entry.endYear}`}
            summary={entry.summary}
            title={`${entry.role} / ${entry.employer}`}
            titleLevel={3}
          >
            <ul>
              {entry.highlights.slice(0, workExperienceHighlightLimit).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </LcdEntryPanel>
        ))}
      </LcdContentSection>

      <LcdContentSection headingId="work-skills-heading" title="Technical Kit">
        <div className="work-skill-list">
          {resumeContent.skills.map((skill) => (
            <p key={skill.name}>
              <strong>{skill.name}</strong>: {skill.summary}
            </p>
          ))}
        </div>
      </LcdContentSection>

      <LcdContentSection headingId="work-soft-heading" title="Team Moves">
        <ul>
          {resumeContent.softCompetencies.slice(0, workSoftCompetencyLimit).map((competency) => (
            <li key={competency}>{competency}</li>
          ))}
        </ul>
      </LcdContentSection>

      <LcdContentSection headingId="work-education-heading" title="Education">
        {resumeContent.education.map((entry) => (
          <p key={`${entry.school}-${entry.degree}`}>
            {entry.degree} / {entry.school} / {entry.startYear}-{entry.endYear}
          </p>
        ))}
      </LcdContentSection>
    </LcdScrollableArea>
  )
}
