import { Leaf } from '../Leaf/leaf.ts'

export interface Forest {
    load(callback?: (leaf: Leaf) => void): Promise<Leaf>
    save(tree: Leaf): Promise<void>
}
