import './App.css'
import {Leaf, Status} from "./Tree/leaf.ts";
import {RawNodeDatum, Tree} from "react-d3-tree";

function App() {

    const root = new Leaf('root');
    const left = new Leaf('left', root);
    const right = new Leaf('right', root);
    const n00b = new Leaf('n00b', right);

    left.status = Status.doing;

    const data = toDatum(root);

    function toDatum(leaf: Leaf): RawNodeDatum {
        return {
            name: leaf.name,
            attributes: {"status": leaf.status},
            children: leaf.children.map(toDatum)
        }
    }

    function renderCard({nodeDatum, toggleNode}) {
        return <g className={`card ${nodeDatum.attributes.status}`}>
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="1" floodOpacity="0.3"/>
                </filter>
            </defs>
            <rect width="100" height="100" x="-50" y="-50"
                  filter="url(#shadow)"
                  onClick={toggleNode}
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

    return (
        <>
            <h3>Disco</h3>
            <Tree data={data}
                  collapsible={false}
                  dimensions={{
                      width: 1000,
                      height: 1000,
                  }}
                  draggable={true}
                  zoomable={true}
                  orientation={'vertical'}
                  translate={{x: 500, y: 20}}
                  initialDepth={100}
                  pathFunc={'step'}
                  renderCustomNodeElement={renderCard}
            />
        </>
    )
}

export default App
