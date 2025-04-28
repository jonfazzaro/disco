import {Leaf} from "../Tree/core/leaf.ts";

export interface Forest {
    load(callback?: (leaf:Leaf) => void): Promise<Leaf>
    save(tree: Leaf): Promise<void>
}

export interface LivingForest extends Forest {
    watch(callback: (leaf:Leaf) => void): void
}