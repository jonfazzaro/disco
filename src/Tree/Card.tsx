import {CustomNodeElementProps} from "react-d3-tree";

export function Card({nodeDatum, onNodeClick}: CustomNodeElementProps) {
    return <foreignObject width="105" height="105" x="-50" y="-50">
        <div className={`card ${nodeDatum.attributes?.status}`} onClick={onNodeClick}>
            <div className="name">{truncateString(nodeDatum.name)}</div>
        </div>
    </foreignObject>

    function truncateString(str: string, maxLength: number = 30): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}