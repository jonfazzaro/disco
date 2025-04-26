import {Leaf, Status} from "./leaf.ts";
import {useTree} from "./useTree.ts";
import {CustomNodeElementProps, RawNodeDatum, Tree as ReactD3Tree} from "react-d3-tree";
import {useCallback, useState} from "react";
import './Tree.css'

export function Tree({root}:{ root: Leaf}) {
    const [translate, containerRef] = useCenteredTree();
    const {data, change} = useTree(root);

    return <div className="tree" ref={containerRef}>
        <ReactD3Tree data={data}
              collapsible={false}
              zoomable={false}
              orientation={'vertical'}
              translate={translate}
              initialDepth={100}
              pathFunc={'step'}
              renderCustomNodeElement={renderCard}
              onNodeClick={e => {
                  change(id(e.data), leaf => {
                      leaf.status = Status.done
                      // Leaf.create({
                      //     name: `child of ${leaf.name}`,
                      //     parent: leaf
                      // }) 
                  })
              }}
        />
    </div>

    function renderCard({nodeDatum, onNodeClick}: CustomNodeElementProps) {
        return <g className={`card ${nodeDatum.attributes?.status}`} onClick={onNodeClick}>
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="1" floodOpacity="0.3"/>
                </filter>
            </defs>
            <rect width="100"
                  height="100"
                  x="-50"
                  y="-50"
                  filter="url(#shadow)"
            />
            <text
                strokeWidth="0"
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle">
                {nodeDatum.name}
            </text>
        </g>;
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

    function id(node: RawNodeDatum) {
        return node.attributes?.id as string;
    }
}