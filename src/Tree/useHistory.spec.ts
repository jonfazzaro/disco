import { act, renderHook } from '@testing-library/react'
import { HistoryHook, useHistory } from './useHistory.ts'

describe('The history hook', () => {
    let result: { current: HistoryHook }
    const one = { title: 'this one' }
    const two = { title: 'this, too' }

    beforeEach(() => {
        result = renderHook(() => useHistory(one)).result
    })

    describe('given nothing tracked', () => {
        it('returns the initial state', () => {
            expect(result.current.undo()).toEqual(one)
        })
    })

    describe('when tracking one entry', () => {
        beforeEach(() => {
            act(() => result.current.track(one))
        })

        it('returns that entry', () => {
            expect(result.current.undo()).toEqual(one)
        })

        describe('and then another', () => {
            beforeEach(() => {
                act(() => result.current.track(two))
            })

            it('returns the latest entry', () => {
                expect(result.current.undo()).toEqual(two)
            })

            describe('then asking for the last again', () => {
                beforeEach(() => {
                    act(() => result.current.undo())
                })

                it('returns the item before that', () => {
                    expect(result.current.undo()).toEqual(one)
                })
            })
        })
    })
})
