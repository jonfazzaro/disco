export class Leaf {
    private _status: string = 'new'
    children: Leaf[] = []

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
        if (!this.parent) return 
        if (this.parent.children.some(c => c.status === 'doing')) 
            this.parent.status = 'doing';
        if (this.parent.children.every(c => c.status === 'done'))
            this.parent.status = 'done';
    }

    constructor(public parent: Leaf | null = null) {
        parent?.children?.push(this);
    }

}