import {TreeNodeDatum} from "react-d3-tree";
import {Leaf, Status} from "./leaf.ts";

export interface ToolbarProps {
    nodeDatum: TreeNodeDatum;
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function useToolbar({nodeDatum, onChange}: ToolbarProps) {
    return {
        addChild,
        deleteLeaf,
        set
    }

    function addChild() {
        onChange(nodeDatum?.attributes?.id as string, leaf => {
            return Leaf.create({
                name: `child of ${nodeDatum.name}`,
                parent: leaf
            })
        });
    }

    function deleteLeaf() {
        onChange(nodeDatum?.attributes?.id as string, leaf => {
            leaf.delete()
        });
    }

    function set(status: Status) {
        return () => onChange(nodeDatum.attributes?.id as string, l => l.status = status)
    }

}