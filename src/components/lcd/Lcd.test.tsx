import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  LcdActionLink,
  LcdPage,
  LcdPanel,
  LcdPixelList,
  LcdScrollableArea,
  LcdSelectableButton,
  LcdSelectableLink,
  LcdSelectableList,
} from './index'

describe('shared LCD components', () => {
  it('renders the reusable LCD page frame and common content primitives', () => {
    render(
      <LcdPage title="Status">
        <LcdScrollableArea aria-label="Status details">
          <LcdPanel as="article" aria-label="Signal panel" className="custom-panel">
            <p>Stable signal</p>
          </LcdPanel>

          <LcdPixelList items={['React', 'TypeScript']} />

          <LcdSelectableList aria-label="Status actions">
            <LcdSelectableLink href="/work" isSelected>
              Work
            </LcdSelectableLink>
            <LcdSelectableLink href="/projects">Projects</LcdSelectableLink>
            <LcdSelectableButton isSelected>Snake</LcdSelectableButton>
          </LcdSelectableList>
        </LcdScrollableArea>

        <LcdActionLink href="/resume.pdf" target="_blank" rel="noreferrer">
          Open PDF
        </LcdActionLink>
      </LcdPage>,
    )

    expect(screen.getByRole('heading', { name: /> status/i })).toHaveClass('lcd-title')

    const scrollableArea = screen.getByRole('region', { name: /status details/i })
    expect(scrollableArea).toHaveClass('lcd-page')
    expect(screen.getByRole('article', { name: /signal panel/i })).toHaveClass(
      'lcd-section',
      'custom-panel',
    )

    const pixelItems = screen.getAllByRole('listitem')
    expect(pixelItems.map((item) => item.textContent)).toEqual(['React', 'TypeScript'])
    expect(pixelItems[0].closest('ul')).toHaveClass('pixel-list')

    const actionList = screen.getByRole('navigation', { name: /status actions/i })
    const selectedAction = within(actionList).getByRole('link', { name: 'Work' })
    const selectedButton = within(actionList).getByRole('button', { name: 'Snake' })

    expect(actionList).toHaveClass('lcd-selectable-list')
    expect(selectedAction).toHaveClass('is-selected')
    expect(selectedAction).toHaveAttribute('data-selected', 'true')
    expect(selectedButton).toHaveClass('is-selected')
    expect(selectedButton).toHaveAttribute('data-selected', 'true')
    expect(selectedButton).toHaveAttribute('type', 'button')
    expect(screen.getByRole('link', { name: /open pdf/i })).toHaveClass('lcd-action-link')
  })
})
