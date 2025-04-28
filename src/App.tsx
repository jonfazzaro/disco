import {Tree} from "./Tree/Tree.tsx";
import {FirebaseRealtimeForest} from "./Forest/FirebaseRealtimeForest.ts";
import {RealIdGenerator} from "./IdGenerator.ts";
import './App.css'

function App() {
    return <>
        <header>
            <div className="logo">
                <h1>🪩 Disco</h1>
                <small>for <a href="https://www.industriallogic.com/blog/discovery-trees/">Discovery Trees</a></small>
            </div>
            <p>Share this URL ☝️ to collaborate!</p>
            <button onClick={newTree}>🌳 New Tree</button>
        </header>
        <Tree forest={new FirebaseRealtimeForest(key())}/>
    </>
}

function key() {
    if (noKeyInURL()) newTree();
    return getKeyFromURL()
}

function noKeyInURL() {
    return window.location.pathname === "/";
}

function newTree() {
    window.location.href = "/" + new RealIdGenerator().nextId()
}

function getKeyFromURL() {
    return window.location.pathname.substring(1);
}

export default App
