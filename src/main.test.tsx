import { act, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('app entrypoint', () => {
  beforeEach(() => {
    vi.resetModules()
    window.history.replaceState({}, '', '/')
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('mounts the routed Pocket Dev Device at / without boilerplate setup', async () => {
    await act(async () => {
      await import('./main')
    })

    expect(await screen.findByRole('main', { name: /pocket dev device/i })).toBeInTheDocument()
  })
})
