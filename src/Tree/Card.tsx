import {CustomNodeElementProps} from "react-d3-tree";
import {Leaf} from "./leaf.ts";
import * as React from "react";
import './Card.css'

interface CardProps extends CustomNodeElementProps {
    isSelected: boolean,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Card({nodeDatum, onNodeClick, isSelected, onChange}: CardProps) {
    function onChangeName(event: React.FormEvent<HTMLTextAreaElement>) {
        event.currentTarget.style.height = "auto";
        event.currentTarget.style.height = event.currentTarget.scrollHeight + "px";
        onChange(nodeDatum.attributes?.id as string, l => l.name = event.currentTarget.value);
    }

    return <foreignObject width="102" height="102" x="-51" y="-51">
        <div className={`card ${nodeDatum.attributes?.status} ${isSelected ? 'selected' : ''}`}
             onClick={onNodeClick}>
            <textarea className="name"
                      name="tree-leaf-name"
                      value={truncateString(nodeDatum.name)}
                      onInput={onChangeName}
                      onKeyDown={blurOnEnter}
                      autoComplete="off"
                      rows={1}
                      maxLength={40}
            />{}
        </div>
    </foreignObject>

    function blurOnEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter')
            event.currentTarget.blur();
    }

    function truncateString(str: string, maxLength: number = 40): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}