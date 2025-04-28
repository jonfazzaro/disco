import {Leaf} from "./core/leaf.ts";
import {useState} from "react";
import {RawNodeDatum, TreeNodeDatum} from "react-d3-tree";
import {deepClone} from "../deepClone.ts";
import {useKeyPress} from "../useKeyPress.ts";
import {HierarchyPointNode} from "d3-hierarchy";
import {id} from "./node.ts";

export function useTree(root: Leaf, onChange: (leaf: Leaf) => void = () => {}) {
    const [tree, setTree] = useState(root)
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useKeyPress('Escape', () => {
        setSelectedId(null);
    }); 
    
    return {
        data: toDatum(tree),
        changeLeaf,
        selectedId,
        selectLeaf
    };

    function selectLeaf(e: HierarchyPointNode<TreeNodeDatum>) {
        setSelectedId(id(e.data))
    }

    function changeLeaf(id: string, update: (leaf: Leaf) => void) {
        const leaf = findLeaf(id, tree)
        if (!leaf) return
        update(leaf)
        bind()
        onChange(tree)
    }

    function findLeaf(id: string, root: Leaf): Leaf | undefined {
        if (root.id === id) return root;
        return root.children?.map(r => findLeaf(id, r)).filter(Boolean)[0]
    }

    function toDatum(root: Leaf): RawNodeDatum {
        return {
            name: root.name,
            attributes: {
                id: root.id,
                status: root.status
            },
            children: root.children.map(toDatum)
        }
    }

    function bind() {
        setTree(l => deepClone(l))
    }
}