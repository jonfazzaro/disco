import {Tree} from "./Tree/Tree.tsx";
import {FirebaseRealtimeForest} from "./Forest/FirebaseRealtimeForest.ts";
import {RealIdGenerator} from "./IdGenerator.ts";
import './App.css'

function App() {
    return <>
        <header>
            <h1>🪩 Disco</h1>
        </header>
        <Tree forest={new FirebaseRealtimeForest(key())}/>
    </>

    function key() {
        if (window.location.pathname === "/")
            window.location.href = "/" + new RealIdGenerator().nextId()

        return window.location.pathname.substring(1)
    }
}

export default App
