import { RealIdGenerator } from '../IdGenerator.ts'

export interface CreateLeaf {
    name: string
    parent?: Leaf | null
    status?: Status | undefined
    id?: string | null
}

export interface SerializedLeaf {
    id: string
    name: string
    status: Status
    children: SerializedLeaf[]
}

export class Leaf {
    id: string
    name: string
    children: Leaf[] = []
    parent: Leaf | null = null
    private _status: Status = Status.new

    static create({ name, parent, status, id }: CreateLeaf) {
        return new Leaf(name, parent, status, id)
    }

    private constructor(
        name: string,
        parent: Leaf | null = null,
        status: Status | undefined,
        id: string | null | undefined = null,
    ) {
        this.id = id || this.nextId()
        this.name = name
        this.parent = parent
        this.status = status || Status.new
        this.parent?.children?.push(this)
    }

    toString() {
        return `${this.name} (${this.status})`
    }

    get status(): Status {
        return this._status
    }

    set status(value: Status) {
        this._status = value
        this.inheritCanceled()
        this.parent?.propagateStatus()
    }

    propagateStatus() {
        this.propagateIfSome(Status.doing)
        this.propagateIfSome(Status.blocked)
    }

    delete() {
        this.status = Status.canceled
        this.pick()
    }

    serialize(): SerializedLeaf {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            children: this.children.map(c => c.serialize()),
        }
    }

    static deserialize(data: SerializedLeaf) {
        let { name, parent, status, id }: CreateLeaf = data
        const leaf = Leaf.create({ name, parent, status, id }) as Leaf
        leaf.children = data.children?.map(Leaf.deserialize) || []
        leaf.children.forEach(c => (c.parent = leaf))
        return leaf
    }

    private nextId() {
        return new RealIdGenerator().nextId()
    }

    private inheritCanceled() {
        if (this.status === Status.canceled) this.children.forEach(c => (c.status = Status.canceled))
    }

    private propagateIfSome(status: Status) {
        if (this.children.some(c => c.status === status)) this.status = status
    }

    private pick() {
        if (!this.parent) return
        this.parent.children = this.parent.children.filter(c => c !== this)
        this.parent = null
    }
}

export enum Status {
    new = 'new',
    doing = 'doing',
    done = 'done',
    canceled = 'canceled',
    blocked = 'blocked',
}
