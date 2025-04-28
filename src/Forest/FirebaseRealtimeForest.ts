import {get, getDatabase, onValue, ref, update} from "firebase/database";
import {Leaf} from "../Tree/core/leaf.ts";
import {Forest} from "./Forest.ts";

export class FirebaseRealtimeForest implements Forest {
    private database = getDatabase()
    
    constructor(private readonly key: string = "tree") { }

    async load(callback?: (leaf: Leaf) => void) {
        if (typeof callback === 'function') 
            this.watch(callback)
        return await this.get();
    }

    async save(tree: Leaf) {
        await update(this.getRef(), tree.serialize())
    }

    private watch(callback: (leaf: Leaf) => void): void {
        if (typeof callback !== 'function') return

        onValue(this.getRef(), (snapshot) => {
            callback(Leaf.deserialize(snapshot.val()))
        });
    }

    private async get() {
        const snapshot = await get(this.getRef())
        if (snapshot.exists())
            return Leaf.deserialize(snapshot.val())

        return Leaf.create({name: "Goal"})
    }

    private getRef() {
        return ref(this.database, this.key);
    }
}