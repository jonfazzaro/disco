import {Tree} from "./Tree/Tree.tsx";
import {FirebaseRealtimeForest} from "./Forest/FirebaseRealtimeForest.ts";
import {KeyMaster} from "./KeyMaster.ts";
import './App.css'

function App() {
    const keyMaster = KeyMaster.create()
    const forest = FirebaseRealtimeForest.create(keyMaster.key())
    
    return <>
        <header>
            <div className="logo">
                <h1>🪩 Disco</h1>
                <small>for <a href="https://www.industriallogic.com/blog/discovery-trees/">Discovery Trees</a></small>
            </div>
            <p>Share this URL ☝️ to collaborate!</p>
            <button onClick={_e => keyMaster.newTree()}>🌳 New Tree</button>
        </header>
        <Tree forest={forest}/>
    </>
}

export default App
