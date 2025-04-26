import {Leaf} from "./leaf.ts";
import {useState} from "react";
import {RawNodeDatum} from "react-d3-tree";
import {deepClone} from "../deepClone.ts";

export function useTree(root: Leaf) {
    const [tree, setTree] = useState(root)
    
    return {
        data: toDatum(tree), 
        change
    };

    function change(id: string, update: (leaf: Leaf) => void) {
        const leaf = findLeaf(id, tree)
        if (!leaf) return
        update(leaf)
        bind()
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