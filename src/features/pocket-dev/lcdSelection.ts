import { useCallback, useState } from 'react'
import type { SelectionDelta } from './types'

export interface LcdSelection {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  moveSelection: (delta: SelectionDelta) => void
}

interface LcdSelectionOptions {
  resetKey?: string
}

interface LcdSelectionState {
  appliedResetKey?: string
  selectedIndex: number
}

const firstSelectableIndex = 0

export function useLcdSelection(
  selectableItemCount: number,
  { resetKey }: LcdSelectionOptions = {},
): LcdSelection {
  const lastSelectableIndex = Math.max(firstSelectableIndex, selectableItemCount - 1)
  const [selectionState, setSelectionState] = useState<LcdSelectionState>({
    appliedResetKey: resetKey,
    selectedIndex: firstSelectableIndex,
  })
  const shouldResetSelection =
    resetKey !== undefined && selectionState.appliedResetKey !== resetKey
  const shouldClearResetKey =
    resetKey === undefined && selectionState.appliedResetKey !== undefined
  const selectedIndex = shouldResetSelection
    ? firstSelectableIndex
    : clampSelectionIndex(selectionState.selectedIndex, lastSelectableIndex)

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
        selectedIndex: clampSelectionIndex(index, lastSelectableIndex),
      })
    },
    [lastSelectableIndex, resetKey],
  )

  const moveSelection = useCallback(
    (delta: SelectionDelta) => {
      setSelectionState((currentState) => {
        const hasPendingReset =
          resetKey !== undefined && currentState.appliedResetKey !== resetKey
        const currentIndex = hasPendingReset
          ? firstSelectableIndex
          : clampSelectionIndex(currentState.selectedIndex, lastSelectableIndex)

        return {
          appliedResetKey: resetKey,
          selectedIndex: getWrappedSelectionIndex(currentIndex, delta, lastSelectableIndex),
        }
      })
    },
    [lastSelectableIndex, resetKey],
  )

  return {
    selectedIndex,
    setSelectedIndex,
    moveSelection,
  }
}

function getWrappedSelectionIndex(
  currentIndex: number,
  delta: SelectionDelta,
  lastSelectableIndex: number,
) {
  if (currentIndex === firstSelectableIndex && delta < 0) return lastSelectableIndex
  if (currentIndex === lastSelectableIndex && delta > 0) return firstSelectableIndex
  return clampSelectionIndex(currentIndex + delta, lastSelectableIndex)
}

function clampSelectionIndex(index: number, lastSelectableIndex: number) {
  return Math.min(Math.max(index, firstSelectableIndex), lastSelectableIndex)
}
