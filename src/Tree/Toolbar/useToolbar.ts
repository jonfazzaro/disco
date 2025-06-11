import { Leaf, Status } from '../../Leaf/leaf.ts'
import { CardProps } from '../Card/Card.tsx'
import { id } from '../node.ts'

export function useToolbar(
    { node, changeLeaf }: CardProps,
) {
    return {
        addChild,
        deleteLeaf,
        changeStatus,
    }

    function addChild() {
        changeLeaf(id(node), leaf => {
            return Leaf.create({
                name: `task`,
                parent: leaf,
            })
        })
    }

    function deleteLeaf() {
        changeLeaf(id(node), leaf => leaf.delete())
    }

    function changeStatus(status: Status) {
        return () => changeLeaf(id(node), l => (l.status = status))
    }
}
