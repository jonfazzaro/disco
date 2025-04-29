import {RealtimeDatabase} from "./RealtimeDatabase.ts";

export class NullRealtimeDatabase implements RealtimeDatabase {
    constructor(private data: any) {
    }

    get(): Promise<any> {
        return Promise.resolve(this.data);
    }

    onValue(callback: (data: any) => void): void {
        callback(this.data)
    }

    update(value: object): Promise<void> {
        this.data = value;
        return Promise.resolve();
    }
}