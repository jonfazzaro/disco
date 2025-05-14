import { Leaf, Status } from '../Leaf/leaf.ts'
import { useEffect, useState } from 'react'
import { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree'
import { deepClone } from './deepClone.ts'
import { useKeyPress } from '../useKeyPress.ts'
import { id } from './node.ts'
import { Forest } from '../Forest/Forest.ts'

export interface TreeViewModel {
    data: RawNodeDatum
    changeLeaf: (id: string, update: (leaf: Leaf) => void) => void
    selectedId: string | null
    selectLeaf: (datum: TreeNodeDatum) => void
}

export function useTree(forest: Forest) {
    const [tree, setTree] = useState(Leaf.create({ name: 'Loading...', status: Status.canceled }))
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [history, setHistory] = useState<Leaf[]>([])

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

        // Save the current state to history before making changes
        const clonedTree = deepClone(tree)
        setHistory(prev => [...prev, clonedTree])

        update(leaf)
        bind()
        return forest.save(tree).catch(console.error)
    }

    function undo() {
        if (history.length === 0) {
            return
        }

        // Get the last state from history
        const previousState = deepClone(history[history.length - 1])

        // Update the tree with the previous state
        setTree(previousState)

        // Remove the used state from history
        setHistory(prev => prev.slice(0, -1))

        // Save the restored state
        return forest.save(previousState).catch(console.error)
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
