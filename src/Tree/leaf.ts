export class Leaf {

    private _status: Status = Status.new;
    children: Leaf[] = []

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        
        if (this.status === Status.done) {
            this.children.filter(c => c.status === Status.doing).forEach(c => c.status = Status.done);
            this.children.filter(c => c.status === Status.new).forEach(c => c.status = Status.canceled);
        }
        this.parent?.propagateStatus();
    }
    
    propagateStatus() {
        this.propagateIfAll([Status.new]);
        this.propagateIfSome(Status.doing);
        this.propagateIfAll([Status.done, Status.canceled]); 
    }

    private propagateIfAll(statuses: Status[]) {
        if (this.children.every(c => statuses.includes(c.status)))
            this.status = statuses[0]
    }

    private propagateIfSome(status: Status) {
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
