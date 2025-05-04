import { RealtimeDatabase } from './RealtimeDatabase.ts'

export class NullRealtimeDatabase implements RealtimeDatabase {
    onValueCallback: ((data: any) => void) | undefined
    lastSavedData: any

    constructor(
        private data: any,
        private loading: boolean = false,
    ) {
        this.onValueCallback = undefined
    }

    get(): Promise<any> {
        if (this.loading) return new Promise(() => {})
        return Promise.resolve(this.data)
    }

    onValue(callback: (data: any) => void): void {
        this.onValueCallback = callback
    }

    update(value: object): Promise<void> {
        this.data = value
        this.lastSavedData = value
        return Promise.resolve()
    }
}
