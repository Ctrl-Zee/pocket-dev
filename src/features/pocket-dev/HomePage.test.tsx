import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('Home route', () => {
  it('renders the Home Page inside the Pocket Dev experience at /', () => {
    window.history.pushState({}, '', '/')

    render(<HomePage />)

    expect(
      screen.getByRole('main', { name: /pocket dev device/i }),
    ).toBeInTheDocument()

    const lcd = screen.getByRole('region', { name: /lcd screen/i })
    expect(within(lcd).getByRole('heading', { name: /home/i })).toBeInTheDocument()

    const menuItems = within(lcd).getAllByRole('link').map((link) => link.textContent)
    expect(menuItems).toEqual(['About', 'Work', 'Projects', 'Resume', 'Contact'])

    expect(screen.getByLabelText(/pocket dev wordmark/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/d-pad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/a and b buttons/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/select and start buttons/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/speaker grill/i)).toBeInTheDocument()
  })
})
