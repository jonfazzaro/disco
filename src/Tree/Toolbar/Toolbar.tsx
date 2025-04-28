import {Status} from "../core/leaf.ts";
import {useToolbar} from "./useToolbar.ts";
import {CardProps} from "../Card/Card.tsx";
import './Toolbar.css'

export function Toolbar(props:CardProps) {
    const {addChild, deleteLeaf, set} = useToolbar(props)
    
    return <div className="toolbar">
        <button className="add-child" title="Add a new child leaf" onClick={addChild}>➕</button>
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