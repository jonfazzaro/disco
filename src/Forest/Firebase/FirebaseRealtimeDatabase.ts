import { RealtimeDatabase } from './RealtimeDatabase.ts'
import { DatabaseReference, getDatabase, ref, update, get, onValue } from 'firebase/database'

export class FirebaseRealtimeDatabase implements RealtimeDatabase {
    private database = getDatabase()

    constructor(private readonly key: string) {}

    async get(): Promise<any> {
        const snapshot = await get(this.ref())
        if (snapshot.exists()) return snapshot.val()
        return Promise.resolve(null)
    }

    onValue(callback: (data: any) => void): void {
        onValue(this.ref(), snapshot => {
            callback(snapshot.val())
        })
    }

    async update(value: object): Promise<void> {
        return await update(this.ref(), value)
    }

    private ref(): DatabaseReference {
        return ref(this.database, this.key)
    }
}
