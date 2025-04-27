import {IdGenerator, NullIdGenerator, RealIdGenerator} from "../IdGenerator.ts";

export interface CreateLeaf {
    name: string
    parent?: Leaf | null
    status?: Status | undefined
}

export interface CreateNullLeaf extends CreateLeaf {
    id: string
}

export class Leaf {
    id: string;
    name: string;
    children: Leaf[] = []
    parent: Leaf | null = null;
    private _status: Status = Status.new;

    static create({name, parent, status}: CreateLeaf) {
        return new Leaf(name, parent, status)
    }

    static createNull({name, parent, status, id}: CreateNullLeaf) {
        return new Leaf(name, parent, status, new NullIdGenerator(id))
    }

    private constructor(name: string, parent: Leaf | null = null, status: Status | undefined, idGenerator: IdGenerator = new RealIdGenerator()) {
        this.id = idGenerator.nextId();
        this.name = name;
        this.parent = parent
        this.status = status || Status.new;
        this.parent?.children?.push(this);
    }

    toString() {
        return `${this.name} (${this.status})`;
    }

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        this.inheritDone();
        this.parent?.propagateStatus();
    }

    propagateStatus() {
        this.propagateIfAll([Status.new]);
        this.propagateIfSome(Status.doing);
        this.propagateIfAll([Status.done, Status.canceled]);
    }

    private inheritDone() {
        if (this.status === Status.done) {
            this.childrenIn(Status.doing).forEach(c => c.status = Status.done);
            this.childrenIn(Status.new).forEach(c => c.status = Status.canceled);
        }
    }

    private childrenIn(status: Status) {
        return this.children.filter(c => c.status === status);
    }

    private propagateIfAll(statuses: Status[]) {
        if (this.children.every(c => statuses.includes(c.status)))
            this.status = statuses[0]
    }

    private propagateIfSome(status: Status) {
        if (this.children.some(c => c.status === status))
            this.status = status;
    }

    delete() {
        this.status = Status.canceled;
        this.pick();
    }

    private pick() {
        if (!this.parent) return
        this.parent.children = this.parent.children.filter(c => c !== this);
        this.parent = null;
    }
}

export enum Status {
    new = 'new',
    doing = 'doing',
    done = 'done',
    canceled = 'canceled'
}

