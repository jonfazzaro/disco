import {Tree} from "./Tree/Tree.tsx";
import './App.css'

import {FirebaseRealtimeForest} from "./Forest/FirebaseRealtimeForest.ts";

function App() {

    return <>
        <h3>🪩 Disco</h3>
        <Tree forest={new FirebaseRealtimeForest()}/>
    </>
}

export default App
