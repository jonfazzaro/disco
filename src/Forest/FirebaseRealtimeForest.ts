import {DatabaseReference, get, getDatabase, onValue, ref, update} from "firebase/database";
import {Leaf} from "../Tree/core/leaf.ts";
import {Forest} from "./Forest.ts";

export class FirebaseRealtimeForest implements Forest {
    constructor(
        private readonly key: string = "tree", 
        private readonly database : RealtimeDatabase = new FirebaseRealtimeDatabase(this.key)) { }

    async load(callback?: (leaf: Leaf) => void) {
        if (typeof callback === 'function') 
            this.watch(callback)
        return await this.get();
    }

    async save(tree: Leaf) {
        await this.database.update(tree.serialize())
    }

    private watch(callback: (leaf: Leaf) => void): void {
        if (typeof callback !== 'function') return

        this.database.onValue((data) => {
            callback(Leaf.deserialize(data))
        });
    }

    private async get() {
        const data = await this.database.get()
        if (data !== null)
            return Leaf.deserialize(data.val())

        return Leaf.create({name: "Goal"})
    }

}

interface RealtimeDatabase {
    get(): Promise<any>
    onValue(callback: (data: any) => void): void
    update(value: object): Promise<void>
}

class FirebaseRealtimeDatabase implements RealtimeDatabase {
    private database = getDatabase()
    constructor(private readonly key: string) { }

    async get(): Promise<any> {
        const snapshot = await get(this.ref())
        if (snapshot.exists())
            return snapshot.val()
        return Promise.resolve(null);
    }

    onValue(callback: (data: any) => void): void {
        onValue(this.ref(), (snapshot) => {
            callback(snapshot.val())
        });
    }

    async update(value: object): Promise<void> {
        return await update(this.ref(), value)
    }
    
    private ref(): DatabaseReference {
        return ref(this.database, this.key);
    }
}