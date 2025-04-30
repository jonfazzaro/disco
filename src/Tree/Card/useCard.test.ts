import {Leaf} from "../core/leaf.ts";
import {renderHook} from "@testing-library/react";
import {useCard} from "./useCard.ts";

describe('The card hook', () => {
    it('is under test', () => {
        arrangeHook()
    });

    let hook: any
    let lastChangedId: string | null
    let lastChangeCallback: ((leaf: Leaf) => void) | null

    function arrangeHook() {
        hook = renderHook(() =>
            useCard({node, changeLeaf: changeLeafFn, isSelected: false}))
    }

    function model(hook: any) {
        const {result} = hook;
        return result.current;
    }
    
    function changeLeafFn(id: string, callback: (leaf: any) => void) {
        lastChangedId = id
        lastChangeCallback = callback
    }

    const node = {
        name: "Lord Mayor",
        attributes: {id: "1234567890", status: "new"},
        children: [],
        __rd3t: {
            id: "53",
            depth: 1,
            collapsed: false
        }
    }
});