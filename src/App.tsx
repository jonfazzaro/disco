import './App.css'
import {Leaf, Status} from "./Tree/leaf.ts";
import {CustomNodeElementProps, RawNodeDatum, Tree} from "react-d3-tree";
import {useCallback, useState} from "react";

const useCenteredTree = () => {
    const [translate, setTranslate] = useState({x: 0, y: 0});
    const containerRef = useCallback((containerElem: HTMLDivElement | null) => {
        if (containerElem !== null) {
            const {width} = containerElem.getBoundingClientRect();
            setTranslate({x: width / 2, y: 100});
        }
    }, []);
    return [translate, containerRef] as const;
};

function App() {
    const [translate, containerRef] = useCenteredTree();
    // const [leaves, setLeaves] = useState(testData())
    // let data = toDatum(leaves[0]);
    const data = {
        "name": "root",
        "attributes": {"id": "350c47f7-0084-4d4d-9c83-e62b9c68f273", "status": "doing"},
        "children": [{
            "name": "left",
            "attributes": {"id": "2689489d-83a9-44cb-bc4d-9e71bf4f026f", "status": "doing"},
            "children": [{
                "name": "stern",
                "attributes": {"id": "c86fb27f-9e69-4a01-b571-1e5b1cc2c456", "status": "new"},
                "children": []
            }]
        }, {
            "name": "right",
            "attributes": {"id": "d77bf1f4-d27f-472c-b2a4-c4314f3b01e1", "status": "done"},
            "children": [{
                "name": "port",
                "attributes": {"id": "655c6efb-4a9d-4a5f-bb94-5047c8d1202f", "status": "canceled"},
                "children": []
            }, {
                "name": "starboard",
                "attributes": {"id": "27a501c8-63e9-4847-93f8-6677e3cf9792", "status": "done"},
                "children": []
            }]
        }]
    }
    const [tree, setTree] = useState(data);

    function updateNode(id: string, update: (node: RawNodeDatum) => void) {
        setTree(_t => {
            const node = findNode(id, _t)
            if (node) update(node)
            return {..._t};
        })

        function findNode(id: string, tree: RawNodeDatum): RawNodeDatum | undefined {
            if (tree.attributes?.id === id) return tree;
            return tree.children?.map(c => findNode(id, c)).filter(Boolean)[0]
        }
    }

    return (
        <>
            <h3>🪩 Disco</h3>
            <div className="tree" ref={containerRef}>
                <Tree data={tree}
                      collapsible={false}
                      zoomable={false}
                      orientation={'vertical'}
                      translate={translate}
                      initialDepth={100}
                      pathFunc={'step'}
                      renderCustomNodeElement={renderCard}
                      onNodeClick={e => {
                          updateNode(e.data.attributes?.id, leaf => {
                              if (leaf?.attributes) 
                                  leaf.attributes.status = Status.done
                          })
                      }}
                />
            </div>
        </>
    )

    function renderCard({nodeDatum, onNodeClick}: CustomNodeElementProps) {
        return <g className={`card ${nodeDatum.attributes?.status}`}>
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="1" floodOpacity="0.3"/>
                </filter>
            </defs>
            <rect width="100" height="100" x="-50" y="-50"
                  filter="url(#shadow)"
                  onClick={onNodeClick}
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

    function toDatum(root: Leaf): RawNodeDatum {
        return {
            name: root.name,
            attributes: {
                id: root.id,
                status: root.status
            },
            children: root.children.map(toDatum)
        }
    }

    function testData() {
        const root = Leaf.create({name: 'root'});
        const left = Leaf.create({name: 'left', parent: root, status: Status.doing});
        const right = Leaf.create({name: 'right', parent: root});
        const leaves: Leaf[] = [root, left, right]
        leaves.push(Leaf.create({name: 'port', parent: right, status: Status.canceled}))
        leaves.push(Leaf.create({name: 'starboard', parent: right, status: Status.done}))
        leaves.push(Leaf.create({name: 'stern', parent: left}))

        return leaves;
    }


}

export default App
