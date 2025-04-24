export class Leaf {

    private _status: Status = Status.new;
    children: Leaf[] = []

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        if (!this.parent) return
        if (this.parent.children.every(c => [Status.new, Status.canceled].includes(c.status)))
            this.parent.status = Status.new
        if (this.parent.children.some(c => c.status === Status.doing))
            this.parent.status = Status.doing;
        if (this.parent.children.every(c => [Status.done, Status.canceled].includes(c.status)))
            this.parent.status = Status.done;
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
