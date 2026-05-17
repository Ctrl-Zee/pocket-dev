import { Link } from '@tanstack/react-router'
import { LcdPage, LcdSelectableLink, LcdSelectableList } from '@/components/lcd'
import { useDeviceNavigation } from '../Device'
import { pageCatalog } from '../pageCatalog'

export function HomePage() {
  const { homeSelection } = useDeviceNavigation()

  return (
    <LcdPage title="Home">
      <div className="home-screen">
        <div>
          <p className="home-wordmark">POCKET DEV</p>
          <p className="home-version">ANDREW SMITH / SOFTWARE ENGINEER</p>
        </div>

        <LcdSelectableList className="home-menu" aria-label="Home menu">
          {pageCatalog.map((item, itemIndex) => {
            const isSelected = itemIndex === homeSelection.selectedIndex

            return (
              <LcdSelectableLink
                as={Link}
                isSelected={isSelected}
                key={item.href}
                onFocus={() => homeSelection.setSelectedIndex(itemIndex)}
                to={item.href}
              >
                {item.label}
              </LcdSelectableLink>
            )
          })}
        </LcdSelectableList>
      </div>
    </LcdPage>
  )
}
