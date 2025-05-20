import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory.ts'

describe('The history hook', () => {
    describe('given no history when undoing', () => {
        it('does nothing', () => {
            const { result } = renderHook(useHistory)
            result.current.undo()
            expect(result.current.history.length).toEqual(0)
        })
    })

    describe('when changing the object', () => {
        it('has the last version in history', () => {
            const { result } = renderHook(useHistory)
            act(() => {
                result.current.track({ title: 'my_title' })
            })
            expect(result.current.history).toEqual([{ title: 'my_title' }])
        })

        it('multiple changes are stored in history', () => {
            const { result } = renderHook(useHistory)
            act(() => {
                result.current.track({ title: 'my_first_title' })
                result.current.track({ title: 'my_second_title' })
            })
            expect(result.current.history).toEqual([{ title: 'my_first_title' }, { title: 'my_second_title' }])
        })
    })
    // when changing the object then the last version is in the history
    // when changing the object again...
})
