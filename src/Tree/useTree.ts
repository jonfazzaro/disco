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

    useEffect(() => {
        forest.load(setTree).then(setTree)
    }, [])

    useEffect(() => {
        document.title = `Disco / ${tree.name}`
    }, [tree])

    useKeyPress({ key: 'Escape' }, () => {
        setSelectedId(null)
    })

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
        update(leaf)
        bind()
        return forest.save(tree).catch(console.error)
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
