import { LcdActionLink, LcdPage, LcdPanel } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'
import { LcdLabeledBlock } from './presentation'

const resumePdfHref = '/assets/Andrew_Smith_Resume.pdf'
const resumePreviewSkillRows = [
  resumeContent.skills.slice(0, 3).map((skill) => skill.name),
  resumeContent.skills.slice(3, 6).map((skill) => skill.name),
] as const

export function ResumePage() {
  const { identity, highlights } = resumeContent

  return (
    <LcdPage title="Resume">
      <div className="resume-page">
        <LcdPanel className="resume-preview" aria-label="Compact resume preview">
          <div className="resume-preview-header">
            <p className="resume-preview-name">{identity.name}</p>
            <p>{identity.publicTitle}</p>
            <p>{identity.location}</p>
          </div>

          <LcdLabeledBlock label="SUMMARY">
            <p>{identity.summary}</p>
          </LcdLabeledBlock>

          <LcdLabeledBlock label="TOOLS">
            {resumePreviewSkillRows.map((skillRow) => (
              <p key={skillRow.join('/')}>{skillRow.join(' / ')}</p>
            ))}
          </LcdLabeledBlock>

          <LcdLabeledBlock label="SIGNAL">
            <p>{highlights[0]}</p>
          </LcdLabeledBlock>
        </LcdPanel>

        <LcdActionLink
          className="resume-open-pdf"
          href={resumePdfHref}
          target="_blank"
          rel="noreferrer"
        >
          OPEN PDF
        </LcdActionLink>
      </div>
    </LcdPage>
  )
}
