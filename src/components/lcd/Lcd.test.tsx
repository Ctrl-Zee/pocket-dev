import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  LcdActionLink,
  LcdPage,
  LcdPanel,
  LcdScrollableArea,
  LcdSelectableLink,
  LcdSelectableList,
  PixelList,
} from './index'

describe('shared LCD components', () => {
  it('renders the reusable LCD page frame and common content primitives', () => {
    render(
      <LcdPage title="Status">
        <LcdScrollableArea aria-label="Status details">
          <LcdPanel as="article" aria-label="Signal panel" className="custom-panel">
            <p>Stable signal</p>
          </LcdPanel>

          <PixelList items={['React', 'TypeScript']} />

          <LcdSelectableList aria-label="Status actions">
            <LcdSelectableLink href="/work" isSelected>
              Work
            </LcdSelectableLink>
            <LcdSelectableLink href="/projects">Projects</LcdSelectableLink>
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
    expect(actionList).toHaveClass('lcd-selectable-list')
    expect(within(actionList).getByRole('link', { name: 'Work' })).toHaveClass('is-selected')
    expect(within(actionList).getByRole('link', { name: 'Work' })).toHaveAttribute(
      'data-selected',
      'true',
    )
    expect(screen.getByRole('link', { name: /open pdf/i })).toHaveClass('lcd-action-link')
  })
})
