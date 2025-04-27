import {Leaf} from "./leaf.ts";
import {useTree} from "./useTree.ts";
import {RawNodeDatum, Tree as ReactD3Tree} from "react-d3-tree";
import {useCallback, useState} from "react";
import {Card} from "./Card.tsx";
import {Toolbar} from "./Toolbar.tsx";

export function Tree({root}: { root: Leaf }) {
    const [translate, containerRef] = useCenteredTree();
    const {data, change, setSelectedId, selectedId} = useTree(root);

    return <div className="tree" ref={containerRef}>
        <ReactD3Tree data={data}
                     collapsible={false}
                     zoomable={false}
                     orientation={'vertical'}
                     translate={translate}
                     initialDepth={100}
                     pathFunc={'step'}
                     renderCustomNodeElement={e => {
                         return <>
                             {(selectedId === id(e.nodeDatum)) &&
                                 <foreignObject id="toolbar-container" width="220" height="50" x="-111" y="-101">
                                     <Toolbar nodeDatum={e.nodeDatum} onChange={change}/>
                                 </foreignObject>}
                             <foreignObject id="card-container" width="150" height="150" x="-51" y="-51">
                                 <Card nodeDatum={e.nodeDatum} 
                                       isSelected={selectedId === id(e.nodeDatum)}
                                       onChange={change} 
                                       onNodeClick={e.onNodeClick}/>
                             </foreignObject>
                         </>
                     }}
                     onNodeClick={e => {
                         setSelectedId(id(e.data))
                     }}
        />
    </div>

    function useCenteredTree() {
        const [translate, setTranslate] = useState({x: 0, y: 0});
        const containerRef = useCallback((containerElem: HTMLDivElement | null) => {
            if (containerElem !== null) {
                const {width} = containerElem.getBoundingClientRect();
                setTranslate({x: width / 2, y: 100});
            }
        }, []);
        return [translate, containerRef] as const;
    }

    function id(node: RawNodeDatum) {
        return node.attributes?.id as string;
    }
}
