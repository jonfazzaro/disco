import { useState } from 'react'
import { deepClone } from './Tree/deepClone.ts'

export interface HistoryHook<T> {
    history: T[]
    writeHistory: (state: T) => void
    undo: () => T | undefined
    canUndo: boolean
}

export function useHistory<T>(): HistoryHook<T> {
    const [history, setHistory] = useState<T[]>([])

    function writeHistory(state: T) {
        setHistory(prev => [...prev, deepClone(state)])
    }

    function undo(): T | undefined {
        if (history.length === 0) return undefined

        // For multiple items in history, return the second-to-last item
        // For a single item, return that item
        const previousState = history.length > 1
            ? deepClone(history[history.length - 2])
            : deepClone(history[0])

        // Update the history:
        // - If we have 3+ items, remove the last two items
        // - If we have 2 items, keep only the first item
        // - If we have 1 item, clear the history
        setHistory(prev => {
            if (prev.length > 2) {
                return prev.slice(0, -2)
            } else if (prev.length === 2) {
                return [prev[0]]
            } else {
                return []
            }
        })

        return previousState
    }

    return {
        history,
        writeHistory,
        undo,
        canUndo: history.length > 0
    }
}
