import { act, renderHook } from '@testing-library/react'
import { HistoryHook, useHistory } from './useHistory.ts'
import { beforeEach } from 'vitest'

describe('The history hook', () => {
    let result: { current: HistoryHook }

    beforeEach(() => {
        const hook = renderHook(useHistory)
        result = hook.result
    })

    describe('given no history when undoing', () => {
        it('does nothing', () => {
            result.current.undo()
            expect(result.current.history.length).toEqual(0)
        })
    })

    describe('when tracking the object', () => {
        it('has it in history', () => {
            const onlyTitle = { title: 'my_title' }
            act(() => {
                result.current.track(onlyTitle)
            })
            expect(result.current.history).toEqual([{ title: 'my_title' }])
        })

        describe('and tracking another object', () => {
            it('both are stored in history', () => {
                const first = { title: 'my_first_title' }
                const second = { title: 'my_second_title' }
                act(() => {
                    result.current.track(first)
                    result.current.track(second)
                })
                expect(result.current.history).toEqual([first, second])
            })

            it('when undoing the most recent change is removed', () => {
                const first = { title: 'my_first_title' }
                const second = { title: 'my_second_title' }
                act(() => {
                    result.current.track(first)
                    result.current.track(second)
                    result.current.undo()
                })
                expect(result.current.history).toEqual([first])
            })
        })
    })
    // when changing the object then the last version is in the history
    // when changing the object again...
})
