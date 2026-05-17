import { existsSync } from 'node:fs'
import { join } from 'node:path'
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

  it('does not keep unused starter example or network boilerplate in source', () => {
    const removedBoilerplatePaths = [
      'src/features/_example',
      'src/mocks',
      'src/lib/axiosClient.ts',
      'src/lib/queryClient.ts',
    ]

    expect(
      removedBoilerplatePaths.filter((path) => existsSync(join(process.cwd(), path))),
    ).toEqual([])
  })
})
