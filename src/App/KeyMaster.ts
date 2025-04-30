import {IdGenerator, NullIdGenerator, RealIdGenerator} from "../IdGenerator.ts";

interface CreateNullKeyMaster {
    currentPath: string;
    nextId: string;
}

export class KeyMaster {
    static createNull({currentPath, nextId}: CreateNullKeyMaster): KeyMaster {
        return new KeyMaster(new NullLocation(currentPath), new NullIdGenerator(nextId));
    }

    static create() {
        return new KeyMaster();
    }

    private constructor(
        private readonly location: Location = new WindowLocation(),
        private readonly idGenerator: IdGenerator = new RealIdGenerator()
    ) { }

    key(): string {
        if (this.noKeyInUrl()) this.newTree();
        return this.getKeyFromUrl()
    }

    newTree() {
        this.location.go(`/${this.idGenerator.nextId()}`)
    }

    private noKeyInUrl() {
        return this.location.path() === '/';
    }

    private getKeyFromUrl() {
        return this.location.path().substring(1);
    }
}

interface Location {
    path(): string

    go(url: string): void
}

class WindowLocation implements Location {
    path(): string {
        return window.location.pathname
    }
    
    go(url: string) {
        window.location.href = url
    }
}

class NullLocation implements Location {
    constructor(public currentPath: string) {
    }

    path() {
        return this.currentPath
    }

    go(url: string) {
        this.currentPath = url
    }
}