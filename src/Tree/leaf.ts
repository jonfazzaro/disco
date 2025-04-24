export class Leaf {

    private _status: Status = Status.new;
    children: Leaf[] = []

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        this.parent?.inheritStatus();
    }
    
    inheritStatus() {
        if (this.children.length === 0) return;

        this.inheritIfAll(Status.new);
        this.inheritIfSome(Status.doing);
        this.inheritIfAll(Status.done); 
    }

    private inheritIfAll(status: Status) {
        if (this.children.every(c => [status, Status.canceled].includes(c.status)))
            this.status = status
    }

    private inheritIfSome(status: Status) {
        if (this.children.some(c => c.status === status))
            this.status = status;
    }

    constructor(public parent: Leaf | null = null) {
        parent?.children?.push(this);
    }

}

export enum Status {
    new = 'new',
    doing = 'doing',
    done = 'done',
    canceled = 'canceled'
}
