import { TreeNodeDatum } from 'react-d3-tree'
import { Leaf } from '../core/leaf.ts'
import './Card.css'
import { useCard } from './useCard.ts'

export interface CardProps {
    node: TreeNodeDatum
    changeLeaf: (id: string, update: (leaf: Leaf) => void) => void
    isSelected: boolean
}

export function Card(props: CardProps) {
    const { nameRef, onChangeName, blurOnEnter, selectAllText } = useCard(props)

    return (
        <div className={`card ${props.node.attributes?.status} ${props.isSelected ? 'selected' : ''}`}>
            <textarea
                className="name"
                name="tree-leaf-name"
                ref={nameRef}
                value={props.node.name}
                title={props.node.name}
                onInput={onChangeName}
                onKeyDown={blurOnEnter}
                onFocus={selectAllText}
                autoComplete="off"
                rows={1}
            />
        </div>
    )
}
