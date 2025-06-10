import { act, renderHook, RenderHookResult } from '@testing-library/react'
import { TreeViewModel, useTree } from './useTree.ts'
import { Leaf, Status } from '../Leaf/leaf'
import { TreeNodeDatum } from 'react-d3-tree'
import { FirebaseRealtimeForest } from '../Forest/Firebase/FirebaseRealtimeForest'
import { NullRealtimeDatabase } from '../Forest/Firebase/NullRealtimeDatabase.ts'
import { expect } from 'vitest'

describe('The tree hook', () => {
    let tree: Leaf
    let database: NullRealtimeDatabase
    let forest: FirebaseRealtimeForest
    let hook: RenderHookResult<TreeViewModel, unknown>

    beforeEach(async () => {
        arrangeTree()
        database = new NullRealtimeDatabase(tree, true)
        forest = FirebaseRealtimeForest.createNull(database)
        act(() => {
            hook = renderHook(() => useTree(forest))
        })
    })

    it('does not change the title', () => {
        expect(document.title).toEqual('Disco / Loading...')
    })

    it('initializes with a loading state', () => {
        expect(model(hook).data).toEqual({
            name: 'Loading...',
            attributes: expect.objectContaining({
                status: Status.canceled,
            }),
            children: [],
        })
    })

    describe('when loaded', () => {
        beforeEach(async () => {
            arrangeTree()
            database = new NullRealtimeDatabase(tree)
            forest = FirebaseRealtimeForest.createNull(database)
            await act(async () => {
                hook = renderHook(() => useTree(forest))
            })
        })

        it('loads the tree from the forest', async () => {
            expect(model(hook).data).toEqual(loadedData)
        })

        it('sets the title to the name of the root', () => {
            expect(document.title).toEqual('Disco / Root Node')
        })

        describe('when selecting a leaf', () => {
            beforeEach(() => {
                act(() => {
                    model(hook).selectLeaf(nodeDatum)
                })
            })

            it('sets the selected ID', () => {
                expect(model(hook).selectedId).toBe('child456')
            })

            describe('and then pressing ESC', () => {
                beforeEach(() => {
                    pressEsc()
                })

                it('clears selection', () => {
                    expect(model(hook).selectedId).toBeNull()
                })
            })
        })

        describe('when changing a leaf', () => {
            describe("that doesn't exist", () => {
                it('does nothing', () => {
                    act(() => {
                        model(hook).changeLeaf('nonexistent', (leaf: Leaf) => {
                            leaf.name = "This won't work"
                        })
                    })

                    expect(model(hook).data).toEqual(loadedData)
                    expect(database.lastSavedData).not.toBeDefined()
                })
            })

            describe('in the tree', () => {
                beforeEach(() => {
                    act(() => {
                        model(hook).changeLeaf('child456', (leaf: Leaf) => {
                            leaf.name = 'Updated Child'
                            leaf.status = Status.doing
                        })
                    })
                })

                it('updates the leaf in the tree', () => {
                    expect(model(hook).data.children).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: 'Updated Child',
                                attributes: { id: 'child456', status: 'doing' },
                                children: [],
                            }),
                        ]),
                    )
                })

                it('saves the updated tree', () => {
                    expect(database.lastSavedData.children).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: 'Updated Child',
                                status: Status.doing,
                            }),
                        ]),
                    )
                })

                describe('and then pressing Ctrl+Z', () => {
                    beforeEach(() => {
                        pressCtrlZ()
                    })

                    it('restores the previous state', () => {
                        expect(model(hook).data.children).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining({
                                    name: 'Child Node',
                                    attributes: { id: 'child456', status: 'new' },
                                    children: [],
                                }),
                            ]),
                        )
                    })

                    it('saves the restored tree', () => {
                        expect(database.lastSavedData.children).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining({
                                    name: 'Child Node',
                                    status: Status.new,
                                }),
                            ]),
                        )
                    })
                })
            })
        })

        const loadedData = expect.objectContaining({
            name: 'Root Node',
            attributes: {
                id: 'root123',
                status: Status.doing,
            },
            children: expect.arrayContaining([
                expect.objectContaining({
                    name: 'Child Node',
                    attributes: expect.objectContaining({
                        id: 'child456',
                        status: Status.new,
                    }),
                    children: [],
                }),
            ]),
        })
    })

    describe('when undoing', () => {
        describe('given a simple tree structure', () => {
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

            it('restores the previous state', async () => {
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

        describe('given a complex tree structure', () => {
            let tree: Leaf
            let database: NullRealtimeDatabase
            let forest: FirebaseRealtimeForest

            beforeEach(() => {
                // Arrange a more complex tree with multiple levels
                const rootNode = Leaf.create({ name: 'Project', id: 'project1' })

                const feature1 = Leaf.create({
                    name: 'Feature 1',
                    parent: rootNode,
                    status: Status.doing,
                    id: 'feature1',
                })
                const task1 = Leaf.create({ name: 'Task 1', parent: feature1, status: Status.new, id: 'task1' })
                Leaf.create({ name: 'Subtask 1', parent: task1, status: Status.new, id: 'subtask1' })

                const feature2 = Leaf.create({
                    name: 'Feature 2',
                    parent: rootNode,
                    status: Status.new,
                    id: 'feature2',
                })
                Leaf.create({ name: 'Task 2', parent: feature2, status: Status.new, id: 'task2' })

                tree = rootNode

                // Set up the database and forest
                database = new NullRealtimeDatabase(tree)
                forest = FirebaseRealtimeForest.createNull(database)
            })

            it('restores the previous state', async () => {
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

    function arrangeTree() {
        const rootNode = Leaf.create({ name: 'Root Node', id: 'root123' })

        Leaf.create({ name: 'Child Node', parent: rootNode, status: Status.new, id: 'child456' })

        rootNode.status = Status.doing
        tree = rootNode
    }

    function pressEsc() {
        act(() => {
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
            document.dispatchEvent(escapeEvent)
        })
    }

    function pressCtrlZ() {
        act(() => {
            const ctrlZEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })
            document.dispatchEvent(ctrlZEvent)
        })
    }

    function model(hook: any) {
        const { result } = hook
        return result.current
    }

    const nodeDatum: TreeNodeDatum = {
        name: 'Child Node',
        attributes: {
            id: 'child456',
            status: Status.new,
        },
        __rd3t: {
            id: 'child456',
            depth: 1,
            collapsed: false,
        },
    }
})
