import { useState } from 'react'

interface HistoryHook {
    undo: () => void
    track: (data: any) => void
    history: any[]
}

export function useHistory() {
    const [history, setHistory] = useState<object>([])
    return <HistoryHook>{
        undo: () => {},
        track: () => {
            setHistory([{ title: 'my_title' }])
        },
        history,
    }
}
