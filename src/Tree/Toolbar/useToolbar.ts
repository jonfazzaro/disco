import {Leaf, Status} from "../core/leaf.ts";
import {CardProps} from "../Card/Card.tsx";

export function useToolbar({node, changeLeaf}: CardProps) {
    return {
        addChild,
        deleteLeaf,
        set
    }

    function addChild() {
        changeLeaf(node?.attributes?.id as string, leaf => {
            return Leaf.create({
                name: `child of ${node.name}`,
                parent: leaf
            })
        });
    }

    function deleteLeaf() {
        changeLeaf(node?.attributes?.id as string, leaf => {
            leaf.delete()
        });
    }

    function set(status: Status) {
        return () => changeLeaf(node.attributes?.id as string, l => l.status = status)
    }

}