import {IdGenerator, NullIdGenerator, RealIdGenerator} from "../IdGenerator.ts";

export class Leaf {

    name: string;
    children: Leaf[] = []
    parent: Leaf | null = null;
    id: string;

    static create({name, parent = null} : {name: string, parent?: Leaf | null}) {
        return new Leaf(name, parent)
    }

    static createNull({name, parent = null, id} : {name: string, parent?: Leaf | null, id: string}) {
        return new Leaf(name, parent, new NullIdGenerator(id))
    }
    
    private constructor(name: string, parent: Leaf | null = null, idGenerator: IdGenerator = new RealIdGenerator()) {
        this.id = idGenerator.nextId();
        this.name = name;
        this.parent = parent
        this.parent?.children?.push(this);
    }
    
    toString() {
        return `${this.name} (${this.status})`;
    }

    private _status: Status = Status.new;
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

}

export enum Status {
    new = 'new',
    doing = 'doing',
    done = 'done',
    canceled = 'canceled'
}

