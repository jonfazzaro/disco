interface HistoryHook {
    undo: () => void
    history: any[]
}

export function useHistory() {
    return <HistoryHook>{
        undo: () => {},
        history: [],
    }
}
