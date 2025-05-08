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
