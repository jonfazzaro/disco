import {v4 as uuidv4} from "uuid";

export interface IdGenerator {
    nextId(): string
}

export class NullIdGenerator implements IdGenerator {
    constructor(private id: string) {
    }

    nextId() {
        return this.id;
    }
}

export class RealIdGenerator implements IdGenerator {
    nextId() {
        return uuidv4().toString();
    }
}