import {TreeNodeDatum} from "react-d3-tree";
import {Leaf} from "../core/leaf.ts";
import './Card.css'
import {useCard} from "./useCard.ts";

export interface CardProps {
    node: TreeNodeDatum;
    changeLeaf: (id: string, update: (leaf: Leaf) => void) => void
    isSelected: boolean,
}

export function Card(props: CardProps) {
    const { onChangeName, blurOnEnter, truncate } = useCard(props)
    
    return <div className={`card ${props.node.attributes?.status} ${props.isSelected ? 'selected' : ''}`}>
                <textarea className="name"
                          name="tree-leaf-name"
                          value={truncate(props.node.name)}
                          onInput={onChangeName}
                          onKeyDown={blurOnEnter}
                          autoComplete="off"
                          rows={1}
                          maxLength={30}/>
    </div>
}