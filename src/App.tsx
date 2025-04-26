import {Leaf, Status} from "./Tree/leaf.ts";
import {CustomNodeElementProps, RawNodeDatum, Tree} from "react-d3-tree";
import {useCallback, useState} from "react";
import './App.css'

function App() {
    const [translate, containerRef] = useCenteredTree();
    const [tree, setTree] = useState(testData())

    function change(id: string, update: (leaf: Leaf) => void) {
        const leaf = findLeaf(id, tree)
        if (!leaf) return
        update(leaf)
        bind()
    }

    function findLeaf(id: string, root: Leaf): Leaf | undefined {
        if (root.id === id) return root;
        return root.children?.map(r => findLeaf(id, r)).filter(Boolean)[0]
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

    function bind() {
        setTree(l => {
            let newVar = ({...l}) as Leaf;
            console.log(newVar)
            return newVar 
        })
    }

    function id(node: RawNodeDatum) {
        return node.attributes?.id as string;
    }

    return (
        <>
            <h3>🪩 Disco</h3>
            <div className="tree" ref={containerRef}>
                <Tree data={toDatum(tree)}
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
