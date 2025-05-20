import { renderHook } from '@testing-library/react'
import { useHistory } from './useHistory.ts'

describe('The history hook', () => {
    it('exists', () => {
        const { result } = renderHook(useHistory)
        expect(result.current).toBeDefined()
    })
})
