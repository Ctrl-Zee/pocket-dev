import { Link } from '@tanstack/react-router'
import { LcdPage, LcdSelectableButton, LcdSelectableLink, LcdSelectableList } from '@/components/lcd'
import { pageCatalog } from '../navigation/pageCatalog'
import { useDeviceNavigation } from '../orchestration/DeviceNavigationContext'

export function HomePage() {
  const { homeSelection, isSnakeUnlocked, openSnake } = useDeviceNavigation()
  const snakeItemIndex = pageCatalog.length

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
          {isSnakeUnlocked ? (
            <LcdSelectableButton
              isSelected={homeSelection.selectedIndex === snakeItemIndex}
              onClick={openSnake}
              onFocus={() => homeSelection.setSelectedIndex(snakeItemIndex)}
            >
              SNAKE
            </LcdSelectableButton>
          ) : null}
        </LcdSelectableList>
      </div>
    </LcdPage>
  )
}
