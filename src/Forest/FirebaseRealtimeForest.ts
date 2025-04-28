import {get, getDatabase, ref, update} from "firebase/database";
import {Leaf} from "../Tree/core/leaf.ts";
import {Forest} from "./Forest.ts";

export class FirebaseRealtimeForest implements Forest {
    private database = getDatabase()

    async load() {
        const snapshot = await get(ref(this.database, 'tree'))
        if (snapshot.exists()) {
            console.log(snapshot.val())
            return Leaf.deserialize(snapshot.val())
        }

        return Leaf.create({name: "Goal"})
    }

    async save(tree: Leaf) {
        await update(ref(this.database, 'tree'), tree.serialize())
    }
}