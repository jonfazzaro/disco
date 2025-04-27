import {SyntheticEventHandler, TreeNodeDatum} from "react-d3-tree";
import {Leaf} from "./leaf.ts";
import './Card.css'
import {useCard} from "./useCard.ts";

interface CardProps {
    nodeDatum: TreeNodeDatum;
    onNodeClick: SyntheticEventHandler;
    isSelected: boolean,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Card({nodeDatum, onNodeClick, isSelected, onChange}: CardProps) {
    const { onChangeName, blurOnEnter, truncate } = useCard({nodeDatum, onChange})
    
    return <div className={`card ${nodeDatum.attributes?.status} ${isSelected ? 'selected' : ''}`}
                onClick={onNodeClick}>
                <textarea className="name"
                          name="tree-leaf-name"
                          value={truncate(nodeDatum.name)}
                          onInput={onChangeName}
                          onKeyDown={blurOnEnter}
                          autoComplete="off"
                          rows={1}
                          maxLength={30}/>
    </div>


}