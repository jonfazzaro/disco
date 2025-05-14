import { Leaf, Status } from '../Leaf/leaf.ts'
import { useEffect, useState } from 'react'
import { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree'
import { deepClone } from './deepClone.ts'
import { useKeyPress } from '../useKeyPress.ts'
import { id } from './node.ts'
import { Forest } from '../Forest/Forest.ts'
import { useHistory } from '../useHistory.ts'

export interface TreeViewModel {
    data: RawNodeDatum
    changeLeaf: (id: string, update: (leaf: Leaf) => void) => void
    selectedId: string | null
    selectLeaf: (datum: TreeNodeDatum) => void
}

export function useTree(forest: Forest) {
    const [tree, setTree] = useState(Leaf.create({ name: 'Loading...', status: Status.canceled }))
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { writeHistory: addToHistory, undo: undoHistory } = useHistory<Leaf>()

    useEffect(() => {
        forest.load(setTree).then(setTree)
    }, [])

    useEffect(() => {
        document.title = `Disco / ${tree.name}`
    }, [tree])

    useKeyPress({ key: 'Escape' }, () => {
        setSelectedId(null)
    })

    useKeyPress({ key: 'z', ctrl: true }, undo)

    return <TreeViewModel>{
        data: toDatum(tree),
        changeLeaf,
        selectedId,
        selectLeaf,
    }

    function selectLeaf(datum: TreeNodeDatum) {
        setSelectedId(id(datum))
    }
    function changeLeaf(id: string, update: (leaf: Leaf) => void) {
        const leaf = findLeaf(id, tree)
        if (!leaf) return

        // Create a deep clone of the current tree before making changes
        const originalTree = Leaf.deserialize(tree.serialize())
        addToHistory(originalTree)

        update(leaf)
        bind()
        return save(tree)
    }

    async function save(tree: Leaf) {
        try {
            return await forest.save(tree)
        } catch (message) {
            return console.error(message)
        }
    }

    function undo() {
        const previousState = undoHistory()
        if (!previousState) return

        // Use the previous state from history to restore the tree
        setTree(previousState)
        return save(previousState)
    }

    function findLeaf(id: string, root: Leaf): Leaf | undefined {
        if (root.id === id) return root
        return root.children?.map(r => findLeaf(id, r)).filter(Boolean)[0]
    }

    function toDatum(root: Leaf): RawNodeDatum {
        return {
            name: root.name,
            attributes: {
                id: root.id,
                status: root.status,
            },
            children: root.children?.map(toDatum),
        }
    }

    function bind() {
        setTree(l => deepClone(l))
    }
}
