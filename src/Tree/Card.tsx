import {CustomNodeElementProps} from "react-d3-tree";
import {Leaf} from "./leaf.ts";
import * as React from "react";
import './Card.css'

interface CardProps extends CustomNodeElementProps {
    isSelected: boolean,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Card({nodeDatum, onNodeClick, isSelected, onChange}: CardProps) {
    return <foreignObject width="102" height="102" x="-51" y="-51">
        <div className={`card ${nodeDatum.attributes?.status}`}
             onClick={onNodeClick}>
            {isSelected && <h3>Selected!</h3>}
            <input className="name"
                   name="tree-leaf-name"
                   value={truncateString(nodeDatum.name)}
                   onChange={onChangeName}
                   onKeyDown={blurOnEnter}
                   autoComplete="off"
            />{}
        </div>
    </foreignObject>

    function blurOnEnter(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter')
            event.currentTarget.blur();
    }

    function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
        return onChange(nodeDatum.attributes?.id as string, l => l.name = e.target.value);
    }

    function truncateString(str: string, maxLength: number = 30): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}