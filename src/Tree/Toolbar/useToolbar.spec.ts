import { renderHook } from '@testing-library/react'
import { useToolbar } from './useToolbar.ts'
import { Leaf, Status } from '../../Leaf/leaf.ts'

describe('The toolbar', () => {
    beforeEach(() => {
        arrangeTree()
        arrangeCallbackTools()
        arrangeHook()
    })

    it('updates leaf status', () => {
        changeStatus(Status.doing)
        expect(tree.status).toEqual(Status.doing)
    })

    it('adds a child leaf', () => {
        addChildLeaf()
        expect(tree.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'task',
                    parent: tree,
                    status: Status.new,
                }),
            ]),
        )
    })

    describe('when deleting a leaf', () => {
        it('deletes the leaf', () => {
            deleteLeaf(true)
            expect(tree.status).toEqual(Status.canceled)
        })
    })

    let hook: any
    let tree: Leaf
    let lastChangedId: string | null
    let lastChangeCallback: ((leaf: Leaf) => void) | null
    let confirmResult: boolean

    function arrangeHook() {
        hook = renderHook(() => useToolbar({ node, changeLeaf: changeLeafFn, isSelected: false }))
    }

    function deleteLeaf(promptResponse: boolean) {
        confirmResult = promptResponse
        model(hook).deleteLeaf()
        lastChangeCallback?.(tree)
    }

    function addChildLeaf() {
        model(hook).addChild()
        lastChangeCallback?.(tree)
        expect(lastChangedId).toEqual('1234567890')
    }

    function changeStatus(status: Status.doing) {
        model(hook).changeStatus(status)()
        lastChangeCallback?.(tree)
        expect(lastChangedId).toEqual('1234567890')
    }

    function model(hook: any) {
        const { result } = hook
        return result.current
    }

    function arrangeCallbackTools() {
        lastChangedId = null
        lastChangeCallback = null
        confirmResult = false
    }

    function arrangeTree() {
        tree = Leaf.create({ name: 'Lord Mayor', status: Status.new, id: '1234567890' }) as Leaf
    }

    function changeLeafFn(id: string, callback: (leaf: any) => void) {
        lastChangedId = id
        lastChangeCallback = callback
    }

    const node = {
        name: 'Lord Mayor',
        attributes: { id: '1234567890', status: 'new' },
        children: [],
        __rd3t: {
            id: '53',
            depth: 1,
            collapsed: false,
        },
    }
})
