import { renderHook, act } from '@testing-library/react'
import { useHistory } from './useHistory'
import { expect } from 'vitest'

describe('useHistory hook', () => {
  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useHistory<number>())
    
    expect(result.current.history).toEqual([])
    expect(result.current.canUndo).toBe(false)
  })
  
  describe('when adding items to history', () => {
    it('should add items to history', () => {
      const { result } = renderHook(() => useHistory<number>())
      
      act(() => {
        result.current.writeHistory(1)
      })
      
      expect(result.current.history).toEqual([1])
      expect(result.current.canUndo).toBe(true)
      
      act(() => {
        result.current.writeHistory(2)
      })
      
      expect(result.current.history).toEqual([1, 2])
    })
  })
  
  describe('when undoing with empty history', () => {
    it('should return undefined', () => {
      const { result } = renderHook(() => useHistory<number>())
      
      let undoResult: number | undefined
      act(() => {
        undoResult = result.current.undo()
      })
      
      expect(undoResult).toBeUndefined()
      expect(result.current.history).toEqual([])
      expect(result.current.canUndo).toBe(false)
    })
  })
  
  describe('when undoing with one item in history', () => {
    it('should return that item and clear history', () => {
      const { result } = renderHook(() => useHistory<number>())
      
      act(() => {
        result.current.writeHistory(1)
      })
      
      let undoResult: number | undefined
      act(() => {
        undoResult = result.current.undo()
      })
      
      expect(undoResult).toBe(1)
      expect(result.current.history).toEqual([])
      expect(result.current.canUndo).toBe(false)
    })
  })
  
  describe('when undoing with multiple items in history', () => {
    it('should return the previous state and remove it from history', () => {
      const { result } = renderHook(() => useHistory<number>())
      
      act(() => {
        result.current.writeHistory(1)
        result.current.writeHistory(2)
        result.current.writeHistory(3)
      })
      
      let undoResult: number | undefined
      act(() => {
        undoResult = result.current.undo()
      })
      
      expect(undoResult).toBe(2)
      expect(result.current.history).toEqual([1])
      expect(result.current.canUndo).toBe(true)
      
      act(() => {
        undoResult = result.current.undo()
      })
      
      expect(undoResult).toBe(1)
      expect(result.current.history).toEqual([])
      expect(result.current.canUndo).toBe(false)
    })
  })
})