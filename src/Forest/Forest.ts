import {Leaf} from "../Tree/core/leaf.ts";

export interface Forest {
    load(): Promise<Leaf>
    save(tree: Leaf): Promise<void>
}

