import './App.css'
import {Leaf, Status} from "./Tree/leaf.ts";
import {CustomNodeElementProps, RawNodeDatum, Tree} from "react-d3-tree";
import {useCallback, useState} from "react";

function App() {
    const [translate, containerRef] = useCenteredTree();
    const [leaves, setLeaves] = useState(testData())

    function updateNode(id: string, update: (leaf: Leaf) => void) {
        setLeaves(_l => {
            const found = findLeaf(id, _l)
            if (found) update(found)
            return {..._l} as Leaf;
        })
    }

    function findLeaf(id: string, root: Leaf): Leaf | undefined {
        if (root.id === id) return root;
        return root.children?.map(r => findLeaf(id, r)).filter(Boolean)[0]
    }

    function toDatum(root: Leaf): RawNodeDatum {
        const result = {
            name: root.name,
            attributes: {
                id: root.id,
                status: root.status
            },
            children: root.children.map(toDatum)
        };
        console.log(result)
        return result
    }

    function bind() {
        setLeaves(l => ({...l}) as Leaf)
    }

    function id(node: RawNodeDatum) {
        return node.attributes?.id as string;
    }

    function addChild(nodeId: string) {
        const leaf = findLeaf(nodeId, leaves)
        if (!leaf) return
        
        Leaf.create({
            name: `child of ${leaf.name}`,
            parent: leaf
        })
        bind();
    }

    return (
        <>
            <h3>🪩 Disco</h3>
            <div className="tree" ref={containerRef}>
                <Tree data={toDatum(leaves)}
                      collapsible={false}
                      zoomable={false}
                      orientation={'vertical'}
                      translate={translate}
                      initialDepth={100}
                      pathFunc={'step'}
                      renderCustomNodeElement={renderCard}
                      onNodeClick={e => {
                          addChild(id(e.data));
                      }}
                />
            </div>
        </>
    )

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

    function testData() {
        const root = Leaf.create({name: 'root'});
        const left = Leaf.create({name: 'left', parent: root, status: Status.doing});
        const right = Leaf.create({name: 'right', parent: root});
        // const leaves: Leaf[] = [root, left, right]
        // leaves.push(Leaf.create({name: 'port', parent: right, status: Status.canceled}))
        // leaves.push(Leaf.create({name: 'starboard', parent: right, status: Status.done}))
        // leaves.push(Leaf.create({name: 'stern', parent: left}))

        return root;
    }
}

export default App
