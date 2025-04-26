import {Leaf, Status} from "./Tree/leaf.ts";
import {Tree} from "./Tree/Tree.tsx";
import './App.css'

function App() {
    return <>
        <h3>🪩 Disco</h3>
        <Tree root={testData()}/>
    </>

    function testData() {
        const root = Leaf.create({name: 'root'});
        const left = Leaf.create({name: 'left', parent: root, status: Status.doing});
        const right = Leaf.create({name: 'right', parent: root});
        const leaves: Leaf[] = [root, left, right]
        leaves.push(Leaf.create({name: 'port', parent: right, status: Status.canceled}))
        leaves.push(Leaf.create({name: 'starboard', parent: right, status: Status.doing}))
        leaves.push(Leaf.create({name: 'stern', parent: left}))

        return root;
    }
}

export default App
