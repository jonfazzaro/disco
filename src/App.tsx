import {Leaf} from "./Tree/core/leaf.ts";
import {Tree} from "./Tree/Tree.tsx";
import './App.css'

function App() {

    return <>
        <h3>🪩 Disco</h3>
        <Tree root={load()} onChange={save}/>
    </>

    function load() {
        const data = localStorage.getItem("disco_data")
        if (!data) return Leaf.create({name: "Goal"})
        return Leaf.deserialize(JSON.parse(data));
    }

    function save(tree: Leaf) {
        const value = JSON.stringify(tree.serialize());
        console.log(value)
        localStorage.setItem("disco_data", value)
    }
}

export default App
