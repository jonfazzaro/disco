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
        
        const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
        leaves.push(Leaf.create({name: lorem, parent: left}))

        return root;
    }
}

export default App
