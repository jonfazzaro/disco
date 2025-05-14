import { act, renderHook } from '@testing-library/react'
import { useTree } from './useTree'
import { Leaf, Status } from '../Leaf/leaf'
import { FirebaseRealtimeForest } from '../Forest/Firebase/FirebaseRealtimeForest'
import { NullRealtimeDatabase } from '../Forest/Firebase/NullRealtimeDatabase'
import { expect } from 'vitest'

describe('useTree undo functionality', () => {
  describe('with a simple tree structure', () => {
    let tree: Leaf
    let database: NullRealtimeDatabase
    let forest: FirebaseRealtimeForest

    beforeEach(() => {
      // Arrange a simple tree with a root node and a child node
      const rootNode = Leaf.create({ name: 'Root Node', id: 'root123' })
      Leaf.create({ name: 'Child Node', parent: rootNode, status: Status.new, id: 'child456' })
      rootNode.status = Status.doing
      tree = rootNode

      // Set up the database and forest
      database = new NullRealtimeDatabase(tree)
      forest = FirebaseRealtimeForest.createNull(database)
    })

    it('should restore the previous state when undoing a change', async () => {
      // Arrange - render the hook
      const { result } = renderHook(() => useTree(forest))

      // Wait for the tree to load
      await act(async () => {
        // This is just to wait for the useEffect to complete
      })

      // Act - change a leaf
      act(() => {
        result.current.changeLeaf('child456', (leaf: Leaf) => {
          leaf.name = 'Updated Child'
          leaf.status = Status.doing
        })
      })

      // Verify the change was made
      expect(result.current.data.children?.[0].name).toBe('Updated Child')
      expect(result.current.data.children?.[0].attributes?.status).toBe('doing')

      // Act - undo the change
      act(() => {
        // Simulate pressing Ctrl+Z
        const ctrlZEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })
        document.dispatchEvent(ctrlZEvent)
      })

      // Assert - verify the tree was restored to its previous state
      expect(result.current.data.children?.[0].name).toBe('Child Node')
      expect(result.current.data.children?.[0].attributes?.status).toBe('new')

      // Verify the restored tree was saved
      expect(database.lastSavedData.children[0].name).toBe('Child Node')
      expect(database.lastSavedData.children[0].status).toBe('new')
    })
  })

  describe('with a complex tree structure', () => {
    let tree: Leaf
    let database: NullRealtimeDatabase
    let forest: FirebaseRealtimeForest

    beforeEach(() => {
      // Arrange a more complex tree with multiple levels
      const rootNode = Leaf.create({ name: 'Project', id: 'project1' })

      const feature1 = Leaf.create({ name: 'Feature 1', parent: rootNode, status: Status.doing, id: 'feature1' })
      const task1 = Leaf.create({ name: 'Task 1', parent: feature1, status: Status.new, id: 'task1' })
      Leaf.create({ name: 'Subtask 1', parent: task1, status: Status.new, id: 'subtask1' })

      const feature2 = Leaf.create({ name: 'Feature 2', parent: rootNode, status: Status.new, id: 'feature2' })
      Leaf.create({ name: 'Task 2', parent: feature2, status: Status.new, id: 'task2' })

      tree = rootNode

      // Set up the database and forest
      database = new NullRealtimeDatabase(tree)
      forest = FirebaseRealtimeForest.createNull(database)
    })

    it('should restore the previous state when undoing a deep change', async () => {
      // Arrange - render the hook
      const { result } = renderHook(() => useTree(forest))

      // Wait for the tree to load
      await act(async () => {
        // This is just to wait for the useEffect to complete
      })

      // Act - change a deeply nested leaf
      act(() => {
        result.current.changeLeaf('subtask1', (leaf: Leaf) => {
          leaf.name = 'Updated Subtask'
          leaf.status = Status.doing
        })
      })

      // Verify the change was made
      const feature1 = result.current.data.children?.[0]
      const task1 = feature1?.children?.[0]
      const subtask1 = task1?.children?.[0]

      expect(subtask1?.name).toBe('Updated Subtask')
      expect(subtask1?.attributes?.status).toBe('doing')

      // Act - undo the change
      act(() => {
        // Simulate pressing Ctrl+Z
        const ctrlZEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })
        document.dispatchEvent(ctrlZEvent)
      })

      // Assert - verify the tree was restored to its previous state
      const restoredFeature1 = result.current.data.children?.[0]
      const restoredTask1 = restoredFeature1?.children?.[0]
      const restoredSubtask1 = restoredTask1?.children?.[0]

      expect(restoredSubtask1?.name).toBe('Subtask 1')
      expect(restoredSubtask1?.attributes?.status).toBe('new')

      // Verify the restored tree was saved
      const savedFeature1 = database.lastSavedData.children[0]
      const savedTask1 = savedFeature1.children[0]
      const savedSubtask1 = savedTask1.children[0]

      expect(savedSubtask1.name).toBe('Subtask 1')
      expect(savedSubtask1.status).toBe('new')
    })
  })
})
