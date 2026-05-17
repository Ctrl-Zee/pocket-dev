import { useCallback, useState } from 'react'
import type { SelectionDelta } from './types'

export interface LcdSelection {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  moveSelection: (delta: SelectionDelta) => void
  resetSelection: () => void
}

interface LcdSelectionOptions {
  resetKey?: string
}

interface LcdSelectionState {
  appliedResetKey?: string
  selectedIndex: number
}

const firstActionableRowIndex = 0

export function useLcdSelection(
  actionableRowCount: number,
  { resetKey }: LcdSelectionOptions = {},
): LcdSelection {
  const lastActionableRowIndex = Math.max(firstActionableRowIndex, actionableRowCount - 1)
  const [selectionState, setSelectionState] = useState<LcdSelectionState>({
    appliedResetKey: resetKey,
    selectedIndex: firstActionableRowIndex,
  })
  const shouldResetSelection =
    resetKey !== undefined && selectionState.appliedResetKey !== resetKey
  const shouldClearResetKey =
    resetKey === undefined && selectionState.appliedResetKey !== undefined
  const selectedIndex = shouldResetSelection
    ? firstActionableRowIndex
    : clampSelectionIndex(selectionState.selectedIndex, lastActionableRowIndex)

  if (shouldResetSelection || shouldClearResetKey) {
    setSelectionState({
      appliedResetKey: resetKey,
      selectedIndex,
    })
  }

  const setSelectedIndex = useCallback(
    (index: number) => {
      setSelectionState({
        appliedResetKey: resetKey,
        selectedIndex: clampSelectionIndex(index, lastActionableRowIndex),
      })
    },
    [lastActionableRowIndex, resetKey],
  )

  const resetSelection = useCallback(() => {
    setSelectionState({
      appliedResetKey: resetKey,
      selectedIndex: firstActionableRowIndex,
    })
  }, [resetKey])

  const moveSelection = useCallback(
    (delta: SelectionDelta) => {
      setSelectionState((currentState) => {
        const hasPendingReset =
          resetKey !== undefined && currentState.appliedResetKey !== resetKey
        const currentIndex = hasPendingReset
          ? firstActionableRowIndex
          : clampSelectionIndex(currentState.selectedIndex, lastActionableRowIndex)

        return {
          appliedResetKey: resetKey,
          selectedIndex: getWrappedSelectionIndex(currentIndex, delta, lastActionableRowIndex),
        }
      })
    },
    [lastActionableRowIndex, resetKey],
  )

  return {
    selectedIndex,
    setSelectedIndex,
    moveSelection,
    resetSelection,
  }
}

function getWrappedSelectionIndex(
  currentIndex: number,
  delta: SelectionDelta,
  lastActionableRowIndex: number,
) {
  if (currentIndex === firstActionableRowIndex && delta < 0) return lastActionableRowIndex
  if (currentIndex === lastActionableRowIndex && delta > 0) return firstActionableRowIndex
  return clampSelectionIndex(currentIndex + delta, lastActionableRowIndex)
}

function clampSelectionIndex(index: number, lastActionableRowIndex: number) {
  return Math.min(Math.max(index, firstActionableRowIndex), lastActionableRowIndex)
}
