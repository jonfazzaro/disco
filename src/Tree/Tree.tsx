import {Leaf, Status} from "./leaf.ts";
import {useTree} from "./useTree.ts";
import {RawNodeDatum, Tree as ReactD3Tree} from "react-d3-tree";
import {useCallback, useState} from "react";
import './Tree.css'
import {Card} from "./Card.tsx";

export function Tree({root}: { root: Leaf }) {
    const [translate, containerRef] = useCenteredTree();
    const {data, change} = useTree(root);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return <div className="tree" ref={containerRef}>
        <ReactD3Tree data={data}
                     collapsible={false}
                     zoomable={false}
                     orientation={'vertical'}
                     translate={translate}
                     initialDepth={100}
                     pathFunc={'step'}
                     renderCustomNodeElement={e => <Card {...e} isSelected={selectedId === id(e.nodeDatum)} />}
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
