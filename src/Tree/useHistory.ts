import { useState } from 'react'

export interface HistoryHook {
    track: (item: object) => void
    undo: () => object
}

export function useHistory(initialState: object) {
    const [list, setList] = useState<object[]>([initialState])

    return <HistoryHook>{
        track,
        undo,
    }

    function undo() {
        const result = list.at(-1)
        setList(l => l.slice(0, -1))
        return result
    }

    function track(item: object) {
        setList(l => [...l, item])
    }
}
