import {Leaf, Status} from "../core/leaf.ts";
import {CardProps} from "../Card/Card.tsx";

export function useToolbar({node, changeLeaf}: CardProps) {
    return {
        addChild,
        deleteLeaf,
        changeStatus
    }

    function addChild() {
        changeLeaf(node?.attributes?.id as string, leaf => {
            return Leaf.create({
                name: `task`,
                parent: leaf
            })
        });
    }

    function deleteLeaf() {
        if (confirm('Delete Leaf: Are you sure?'))
            changeLeaf(node?.attributes?.id as string, leaf => leaf.delete());
    }

    function changeStatus(status: Status) {
        return () => changeLeaf(node.attributes?.id as string, l => l.status = status)
    }

}