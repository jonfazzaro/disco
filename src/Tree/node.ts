import { RawNodeDatum } from 'react-d3-tree'

export function id(node: RawNodeDatum) {
    return node.attributes?.id as string
}
