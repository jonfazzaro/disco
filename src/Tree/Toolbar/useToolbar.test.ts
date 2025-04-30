import {renderHook} from "@testing-library/react";
import {useToolbar} from "./useToolbar.ts";
import {Leaf, Status} from "../core/leaf.ts";
import {expect} from "vitest";

describe('The toolbar', () => {
    let hook: any;
    let tree: Leaf;
    let lastChangedId: string | null = null;
    let lastChangeCallback: ((leaf: Leaf) => void) | null = null;

    beforeEach(() => {
        arrangeTree();
        arrangeCallbackTools();
        hook = renderHook(() => useToolbar({node, changeLeaf: changeLeafFn, isSelected: false}));
    });

    it('updates leaf status', () => {
        model(hook).changeStatus(Status.doing)()
        lastChangeCallback?.(tree)
        expect(lastChangedId).toEqual("1234567890")
        expect(tree.status).toEqual(Status.doing)
    });

    it('adds a child leaf', () => {
        model(hook).addChild()
        lastChangeCallback?.(tree)
        expect(lastChangedId).toEqual("1234567890")
        expect(tree.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: "task",
                    parent: tree,
                    status: Status.new
                })
            ])
        )
    });

    function model(hook: any) {
        const {result} = hook;
        return result.current;
    }

    function arrangeCallbackTools() {
        lastChangedId = null;
        lastChangeCallback = null;
    }

    function arrangeTree() {
        tree = Leaf.createNull({
            name: "Lord Mayor",
            id: "1234567890",
            status: Status.new
        })
    }

    const changeLeafFn = (id: string, callback: (leaf: any) => void) => {
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