import { useState } from 'react'

interface HistoryHook {
    undo: () => void
    track: (data: object) => void
    history: object[]
}

export function useHistory() {
    const [history, setHistory] = useState<object[]>([])
    return <HistoryHook>{
        undo: () => {},
        track,
        history,
    }

    function track(value: object) {
        setHistory(h => [...h, value])
    }
}
