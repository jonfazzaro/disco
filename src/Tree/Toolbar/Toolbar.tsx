import {Status} from "../core/leaf.ts";
import {ToolbarProps, useToolbar} from "./useToolbar.ts";

export function Toolbar({nodeDatum, onChange}: ToolbarProps) {
    const {addChild, deleteLeaf, set} = useToolbar({nodeDatum, onChange})
    
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