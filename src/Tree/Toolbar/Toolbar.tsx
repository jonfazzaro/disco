import { Status } from '../../Leaf/leaf.ts'
import { useToolbar } from './useToolbar.ts'
import { CardProps } from '../Card/Card.tsx'
import './Toolbar.css'

export function Toolbar(props: CardProps) {
    const { addChild, deleteLeaf, changeStatus } = useToolbar(props)

    return (
        <div className="toolbar">
            <button className="add-child" title="Add a new child leaf" onClick={addChild}>
                ➕
            </button>
            <div className="set-status">
                <button className="new" title="Set status to new" onClick={changeStatus(Status.new)}></button>
                <button className="doing" title="Set status to doing" onClick={changeStatus(Status.doing)}></button>
                <button className="done" title="Set status to done" onClick={changeStatus(Status.done)}></button>
                <button
                    className="canceled"
                    title="Set status to canceled"
                    onClick={changeStatus(Status.canceled)}></button>
                <button
                    className="blocked"
                    title="Set status to blocked"
                    onClick={changeStatus(Status.blocked)}></button>
            </div>
            <button className="delete" title="Delete leaf" onClick={deleteLeaf}>
                🗑️
            </button>
        </div>
    )
}
