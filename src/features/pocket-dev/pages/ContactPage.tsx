import { LcdPage, LcdScrollableArea, LcdSelectableLink, LcdSelectableList } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'
import { opensContactTargetInCurrentTab } from '../contactTargets'
import { useDeviceNavigation } from '../Device'

export function ContactPage() {
  const { contactSelection } = useDeviceNavigation()

  return (
    <LcdPage title="Contact">
      <LcdScrollableArea className="contact-page">
        <p className="lcd-intro">Direct links for reaching Andrew.</p>

        <LcdSelectableList className="contact-list" aria-label="Contact links">
          {resumeContent.contactTargets.map((contactTarget, contactTargetIndex) => {
            const isSelected = contactTargetIndex === contactSelection.selectedIndex
            const opensInCurrentTab = opensContactTargetInCurrentTab(contactTarget.href)

            return (
              <LcdSelectableLink
                href={contactTarget.href}
                isSelected={isSelected}
                key={contactTarget.label}
                onFocus={() => contactSelection.setSelectedIndex(contactTargetIndex)}
                rel={opensInCurrentTab ? undefined : 'noreferrer'}
                target={opensInCurrentTab ? undefined : '_blank'}
              >
                <span>{contactTarget.label}</span>
                <strong>{contactTarget.value}</strong>
              </LcdSelectableLink>
            )
          })}
        </LcdSelectableList>
      </LcdScrollableArea>
    </LcdPage>
  )
}
