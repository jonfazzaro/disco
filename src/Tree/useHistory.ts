import { useState } from 'react'

export interface HistoryHook {
    undo: () => void
    track: (data: object) => void
    history: object[]
}

export function useHistory() {
    const [history, setHistory] = useState<object[]>([])
    return <HistoryHook>{
        undo,
        track,
        history,
    }

    function undo() {
        setHistory(h => h.slice(0, -1))
    }

    function track(value: object) {
        setHistory(h => [...h, value])
    }
}
