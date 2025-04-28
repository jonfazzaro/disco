import {useTree} from "./useTree.ts";
import {CustomNodeElementProps, Tree as ReactD3Tree} from "react-d3-tree";
import {useCallback, useState} from "react";
import {Card} from "./Card/Card.tsx";
import {Toolbar} from "./Toolbar/Toolbar.tsx";
import {id} from "./node.ts";
import {Forest} from "../Forest.ts";

interface TreeProps {
    forest: Forest;
}

export function Tree({forest}: TreeProps) {
    const [translate, containerRef] = useCenteredTree();
    const {data, changeLeaf, selectedId, selectLeaf} = useTree(forest);

    return <div className="tree" ref={containerRef}>
        <ReactD3Tree
            data={data}
            collapsible={false}
            zoomable={false}
            orientation={'vertical'}
            translate={translate}
            initialDepth={100}
            pathFunc={'step'}
            renderCustomNodeElement={renderCard}
            onNodeClick={selectLeaf}
        />
    </div>

    function renderCard(e: CustomNodeElementProps) {
        const node = e.nodeDatum
        const isSelected = selectedId === id(node)
        
        return <>
            {isSelected &&
                <foreignObject id="toolbar-container" width="220" height="50" x="-111" y="-101">
                    <Toolbar node={node} changeLeaf={changeLeaf} isSelected={isSelected}/>
                </foreignObject>}
            <foreignObject id="card-container" width="150" height="150" x="-51" y="-51" onClick={e.onNodeClick}>
                <Card node={node} changeLeaf={changeLeaf} isSelected={isSelected}/>
            </foreignObject>
        </>
    }

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
}
