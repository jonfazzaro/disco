import { renderHook } from '@testing-library/react'
import { useHistory } from './useHistory.ts'

describe('The history hook', () => {
    it('exists', () => {
        const { result } = renderHook(useHistory)
        expect(result.current).toBeDefined()
    })

    // given no history when undoing does nothing
    describe('given no history when undoing', () => {
        it('does nothing', () => {
            const { result } = renderHook(useHistory)
            result.current.undo()
            expect(result.current.history.length).toEqual(0)
        })
    })

    // when changing the object then the last version is in the history
    // when changing the object again...
})
