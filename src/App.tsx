import {Tree} from "./Tree/Tree.tsx";
import './App.css'

import {FirebaseRealtimeForest} from "./Forest/FirebaseRealtimeForest.ts";

function App() {

    return <>
        <header>
            <h1>🪩 Disco</h1>
        </header>
        <Tree forest={new FirebaseRealtimeForest()}/>
    </>
}

export default App
