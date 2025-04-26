import {CustomNodeElementProps} from "react-d3-tree";
import {Leaf} from "./leaf.ts";
import * as React from "react";
import './Card.css'

interface CardProps extends CustomNodeElementProps {
    isSelected: boolean,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Card({nodeDatum, onNodeClick, isSelected, onChange}: CardProps) {
    return <foreignObject width="150" height="150" x="-51" y="-51">
        <div className={`card ${nodeDatum.attributes?.status} ${isSelected ? 'selected' : ''}`}
             onClick={onNodeClick}>
            <textarea className="name"
                      name="tree-leaf-name"
                      value={truncate(nodeDatum.name)}
                      onInput={onChangeName}
                      onKeyDown={blurOnEnter}
                      autoComplete="off"
                      rows={1}
                      maxLength={30}
            />
            {isSelected && <div className="controls">
                <button onClick={addChild}>➕</button>
            </div>}
        </div>
    </foreignObject>

    function addChild() {
        return () => onChange(nodeDatum?.attributes?.id as string, leaf => Leaf.create({
            name: `child of ${nodeDatum.name}`,
            parent: leaf
        }));
    }

    function onChangeName(event: React.FormEvent<HTMLTextAreaElement>) {
        autoAdjustHeight(event);
        onChange(nodeDatum.attributes?.id as string, l => l.name = event.currentTarget.value);
    }

    function autoAdjustHeight(event: React.FormEvent<HTMLTextAreaElement>) {
        event.currentTarget.style.height = "auto";
        event.currentTarget.style.height = event.currentTarget.scrollHeight + "px";
    }

    function blurOnEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter')
            event.currentTarget.blur();
    }

    function truncate(str: string, maxLength: number = 30): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}