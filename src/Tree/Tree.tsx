import {Leaf} from "./core/leaf.ts";
import {useTree} from "./useTree.ts";
import {CustomNodeElementProps, RawNodeDatum, Tree as ReactD3Tree, TreeNodeDatum} from "react-d3-tree";
import {HierarchyPointNode} from "d3-hierarchy";
import {useCallback, useState} from "react";
import {Card} from "./Card/Card.tsx";
import {Toolbar} from "./Toolbar/Toolbar.tsx";

export function Tree({root}: { root: Leaf }) {
    const [translate, containerRef] = useCenteredTree();
    const {data, changeLeaf, setSelectedId, selectedId} = useTree(root);

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

    function selectLeaf(e: HierarchyPointNode<TreeNodeDatum>) {
        setSelectedId(id(e.data))
    }

    function id(node: RawNodeDatum) {
        return node.attributes?.id as string;
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
