export interface RealtimeDatabase {
    get(): Promise<any>

    onValue(callback: (data: any) => void): void

    update(value: object): Promise<void>
}
