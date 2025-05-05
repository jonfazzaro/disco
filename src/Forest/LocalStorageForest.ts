import { Leaf } from '../Leaf/leaf.ts'
import { Forest } from './Forest.ts'

export class LocalStorageForest implements Forest {
    load() {
        const data = localStorage.getItem('disco_data')
        if (!data) return Promise.resolve(Leaf.create({ name: 'Goal' }))
        return Promise.resolve(Leaf.deserialize(JSON.parse(data)))
    }

    save(tree: Leaf) {
        localStorage.setItem('disco_data', JSON.stringify(tree.serialize()))
        return Promise.resolve()
    }
}
