import { useEffect } from 'react'

export function useKeyPress({ key, ctrl = false }: { key: string; ctrl?: boolean }, action: () => void) {
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [key, ctrl, action])

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === key && (event.ctrlKey === ctrl || event.metaKey === ctrl)) {
            action()
            event.preventDefault()
        }
    }
}
