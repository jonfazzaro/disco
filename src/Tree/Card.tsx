import {CustomNodeElementProps} from "react-d3-tree";
import {Leaf, Status} from "./leaf.ts";
import * as React from "react";
import './Card.css'

interface CardProps extends CustomNodeElementProps {
    isSelected: boolean,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Card({nodeDatum, onNodeClick, isSelected, onChange}: CardProps) {
    return <>
        {isSelected &&
            <foreignObject width="220" height="50" x="-111" y="-101">
                <div className="card-controls">
                    <button className="add-child" title="Add a new child leaf" onClick={addChild}></button>
                    <div className="set-status">
                        <button className="new" title="Set status to new" onClick={set(Status.new)}></button>
                        <button className="doing" title="Set status to doing" onClick={set(Status.doing)}></button>
                        <button className="done" title="Set status to done" onClick={set(Status.done)}></button>
                        <button className="canceled" title="Set status to canceled" onClick={set(Status.canceled)}></button>
                    </div>
                </div>
            </foreignObject>}
        <foreignObject width="150" height="150" x="-51" y="-51">
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
            </div>
        </foreignObject>
    </>

    function addChild() {
        onChange(nodeDatum?.attributes?.id as string, leaf => {
            console.log("add child clicked")
            return Leaf.create({
                name: `child of ${nodeDatum.name}`,
                parent: leaf
            })
        });
    }
    
    function set(status: Status) {
        return () => onChange(nodeDatum.attributes?.id as string, l => l.status = status)
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