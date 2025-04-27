import {Leaf} from "./Tree/core/leaf.ts";
import {Tree} from "./Tree/Tree.tsx";
import './App.css'

function App() {
    return <>
        <h3>🪩 Disco</h3>
        <Tree root={Leaf.create({name: 'Task'})}/>
    </>
}

export default App
