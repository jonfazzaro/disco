import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'
import { expect } from 'vitest'

describe('useHistory hook', () => {
    let result: any
    const one = { value: 1 }
    const two = { value: 2 }
    const three = { value: 3 }

    beforeEach(() => {
        const hook = renderHook(() => useHistory<SpecData>())
        result = hook.result
    })

    it('should initialize with empty history', () => {
        expect(result.current.history).toEqual([])
        expect(result.current.canUndo).toBe(false)
    })

    describe('when adding items to history', () => {
        it('should add first item to history', () => {
            act(() => {
                result.current.writeHistory(one)
            })

            expect(result.current.history).toEqual([one])
            expect(result.current.canUndo).toBe(true)
        })

        it('should add second item to history', () => {
            act(() => {
                result.current.writeHistory(one)
                result.current.writeHistory(two)
            })

            expect(result.current.history).toEqual([one, two])
        })
    })

    describe('when undoing with empty history', () => {
        it('should return undefined', () => {
            let undoResult: number | undefined
            act(() => {
                undoResult = result.current.previous()
            })

            expect(undoResult).toBeUndefined()
            expect(result.current.history).toEqual([])
            expect(result.current.canUndo).toBe(false)
        })
    })

    describe('when undoing with one item in history', () => {
        it('should return that item and clear history', () => {
            act(() => {
                result.current.writeHistory(1)
            })

            let undoResult: number | undefined
            act(() => {
                undoResult = result.current.previous()
            })

            expect(undoResult).toBe(1)
            expect(result.current.history).toEqual([])
            expect(result.current.canUndo).toBe(false)
        })
    })

    describe('when undoing with multiple items in history', () => {
        it('should return the previous state after first undo', () => {
            act(() => {
                result.current.writeHistory(one)
                result.current.writeHistory(two)
                result.current.writeHistory(three)
            })

            let undoResult: number | undefined
            act(() => {
                undoResult = result.current.previous()
            })

            expect(undoResult).toEqual(two)
            expect(result.current.history).toEqual([one])
            expect(result.current.canUndo).toBe(true)
        })

        it('should return the first item after second undo', () => {
            act(() => {
                result.current.writeHistory(one)
                result.current.writeHistory(two)
                result.current.writeHistory(three)
            })

            act(() => {
                result.current.previous()
            })

            let undoResult: number | undefined
            act(() => {
                undoResult = result.current.previous()
            })

            expect(undoResult).toEqual(one)
            expect(result.current.history).toEqual([])
            expect(result.current.canUndo).toBe(false)
        })
    })
})

interface SpecData {
    value: number
}
