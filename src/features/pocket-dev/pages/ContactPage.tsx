import { LcdPage, LcdScrollableArea, LcdSelectableList } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'
import { opensContactTargetInCurrentTab } from '../contact/contactTargets'
import { useDeviceNavigation } from '../orchestration/DeviceNavigationContext'
import { LcdActionRowLink } from './presentation'

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
              <LcdActionRowLink
                href={contactTarget.href}
                isSelected={isSelected}
                key={contactTarget.label}
                label={contactTarget.label}
                onFocus={() => contactSelection.setSelectedIndex(contactTargetIndex)}
                rel={opensInCurrentTab ? undefined : 'noreferrer'}
                target={opensInCurrentTab ? undefined : '_blank'}
                value={contactTarget.value}
              />
            )
          })}
        </LcdSelectableList>
      </LcdScrollableArea>
    </LcdPage>
  )
}
