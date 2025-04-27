import {TreeNodeDatum} from "react-d3-tree";
import {Leaf, Status} from "./leaf.ts";

interface ToolbarProps {
    nodeDatum: TreeNodeDatum;
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}

export function Toolbar({nodeDatum, onChange}: ToolbarProps) {

    function addChild() {
        onChange(nodeDatum?.attributes?.id as string, leaf => {
            return Leaf.create({
                name: `child of ${nodeDatum.name}`,
                parent: leaf
            })
        });
    }

    function deleteLeaf() {
        onChange(nodeDatum?.attributes?.id as string, leaf => {
            leaf.delete()
        });
    }

    function set(status: Status) {
        return () => onChange(nodeDatum.attributes?.id as string, l => l.status = status)
    }

    return <div className="card-controls">
        <button className="add-child" title="Add a new child leaf" onClick={addChild}></button>
        <div className="set-status">
            <button className="new" title="Set status to new" onClick={set(Status.new)}></button>
            <button className="doing" title="Set status to doing" onClick={set(Status.doing)}></button>
            <button className="done" title="Set status to done" onClick={set(Status.done)}></button>
            <button className="canceled" title="Set status to canceled"
                    onClick={set(Status.canceled)}></button>
        </div>
        <button className="delete" title="Delete leaf" onClick={deleteLeaf}>❌</button>
    </div>
}