import {RealtimeDatabase} from "./RealtimeDatabase.ts";

export class NullRealtimeDatabase implements RealtimeDatabase {
    onValueCallback: ((data: any) => void) | undefined;

    constructor(private data: any) {
        this.onValueCallback = undefined;
    }

    get(): Promise<any> {
        return Promise.resolve(this.data);
    }

    onValue(callback: (data: any) => void): void {
        this.onValueCallback = callback;
    }

    update(value: object): Promise<void> {
        this.data = value;
        return Promise.resolve();
    }
}