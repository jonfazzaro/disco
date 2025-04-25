import './App.css'
import {Leaf, Status} from "./Tree/leaf.ts";
import {RawNodeDatum, Tree} from "react-d3-tree";

function App() {

    const root = new Leaf('root');
    const left = new Leaf('left', root);
    const right = new Leaf('right', root);
    const port = new Leaf('port', right);
    const starboard = new Leaf('starboard', right);
    const stern = new Leaf('stern', left);

    left.status = Status.doing;
    port.status = Status.canceled;
    starboard.status = Status.done;
    stern.status = Status.new;

    const data = toDatum(root);
    return (
        <>
            <h3>🪩 Disco</h3>
            <Tree data={data}
                  collapsible={false}
                  dimensions={{
                      width: 1000,
                      height: 1000,
                  }}
                  zoomable={false}
                  orientation={'vertical'}
                  translate={{x: 500, y: 20}}
                  initialDepth={100}
                  pathFunc={'step'}
                  renderCustomNodeElement={renderCard}
            />
        </>
    )
    
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

    function toDatum(leaf: Leaf): RawNodeDatum {
        return {
            name: leaf.name,
            attributes: {"status": leaf.status},
            children: leaf.children.map(toDatum)
        }
    }

    
}

export default App
