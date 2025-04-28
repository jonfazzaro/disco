import {get, getDatabase, onValue, ref, update} from "firebase/database";
import {Leaf} from "../Tree/core/leaf.ts";
import {LivingForest} from "./Forest.ts";

export class FirebaseRealtimeForest implements LivingForest {
    private database = getDatabase()
    
    watch(callback: (leaf: Leaf) => void): void {
        if (typeof callback !== 'function') return
        
        onValue(this.getRef(), (snapshot) => {
            callback(Leaf.deserialize(snapshot.val()))
        });
    }

    async load() {
        const snapshot = await get(this.getRef())
        if (snapshot.exists()) 
            return Leaf.deserialize(snapshot.val())

        return Leaf.create({name: "Goal"})
    }

    async save(tree: Leaf) {
        await update(this.getRef(), tree.serialize())
    }

    private getRef() {
        return ref(this.database, 'tree');
    }
}