import {useEffect} from "react";

export function useKeyPress({key, ctrl = false}:{key:string, ctrl?:boolean }, action: () => void) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === key && (event.ctrlKey === ctrl || event.metaKey === ctrl)) {
                action()
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
}