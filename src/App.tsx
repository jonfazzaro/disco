import {Tree} from "./Tree/Tree.tsx";
import './App.css'
import {LocalStorageForest} from "./Forest.ts";

function App() {

    return <>
        <h3>🪩 Disco</h3>
        <Tree forest={new LocalStorageForest()}/>
    </>
}

export default App
