import { Leaf } from '../../Leaf/leaf.ts'
import { Forest } from '../Forest.ts'
import { RealtimeDatabase } from './RealtimeDatabase.ts'
import { NullRealtimeDatabase } from './NullRealtimeDatabase.ts'
import { FirebaseRealtimeDatabase } from './FirebaseRealtimeDatabase.ts'

export class FirebaseRealtimeForest implements Forest {
    private constructor(
        key: string,
        private readonly database: RealtimeDatabase = new FirebaseRealtimeDatabase(key),
    ) {}

    static create(key: string) {
        return new FirebaseRealtimeForest(key)
    }

    static createNull(nullDatabase: NullRealtimeDatabase) {
        return new FirebaseRealtimeForest('NULL', nullDatabase)
    }

    async load(callback?: (leaf: Leaf) => void) {
        if (typeof callback === 'function') this.watch(callback)
        return await this.get()
    }

    async save(tree: Leaf) {
        await this.database.update(tree.serialize())
    }

    private watch(callback: (leaf: Leaf) => void): void {
        this.database.onValue(data => {
            callback(Leaf.deserialize(data))
        })
    }

    private async get() {
        const data = await this.database.get()
        if (data !== null) return Leaf.deserialize(data)

        return Leaf.create({ name: 'Goal' })
    }
}
