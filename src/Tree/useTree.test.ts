import {act, renderHook, RenderHookResult} from "@testing-library/react";
import {TreeViewModel, useTree} from "./useTree.ts";
import {Leaf, Status} from "./core/leaf";
import {TreeNodeDatum} from "react-d3-tree";
import {FirebaseRealtimeForest} from "../Forest/Firebase/FirebaseRealtimeForest";
import {NullRealtimeDatabase} from "../Forest/Firebase/NullRealtimeDatabase.ts";
import {expect} from "vitest";

describe("useTree", () => {
    let tree: Leaf;
    let database: NullRealtimeDatabase;
    let forest: FirebaseRealtimeForest;
    let hook: RenderHookResult<TreeViewModel, unknown>;

    beforeEach(async () => {
        arrangeTree();
        database = new NullRealtimeDatabase(tree);
        forest = FirebaseRealtimeForest.createNull(database);
        hook = renderHook(() => useTree(forest));
    });

    it.only("initializes with a loading state", () => {
        expect(model(hook).data).toEqual({
            name: "Loading...",
            attributes: expect.objectContaining({
                status: Status.canceled
            }),
            children: []
        })
    });

    describe.only('when loaded', () => {
        beforeEach(async () => {
            await act(async () => {
                hook = renderHook(() => useTree(forest));
            });
        });

        it("loads the tree from the forest", async () => {
            expect(model(hook).data).toEqual(expect.objectContaining({
                name: "Root Node",
                attributes: {
                    id: "root123",
                    status: Status.new,
                },
                children: expect.arrayContaining([
                    expect.objectContaining({
                        name: "Child Node",
                        attributes: expect.objectContaining({
                            id: "child456",
                            status: Status.new
                        }),
                        children: []
                    })
                ])
            }));
        });

        it("selects a leaf when selectLeaf is called", async () => {
            act(() => {
                model(hook).selectLeaf(nodeDatum);
            });

            expect(model(hook).selectedId).toBe("child456");
        });
    });

    it("clears selection when Escape key is pressed", async () => {
        act(() => {
            model(hook).selectLeaf(nodeDatum);
        });

        expect(model(hook).selectedId).toBe("child456");

        // Simulate Escape key press
        act(() => {
            const escapeEvent = new KeyboardEvent('keydown', {key: 'Escape'});
            document.dispatchEvent(escapeEvent);
        });

        expect(model(hook).selectedId).toBeNull();
    });

    it("changes a leaf when changeLeaf is called", async () => {
        act(() => {
            model(hook).changeLeaf("child456", (leaf: Leaf) => {
                leaf.name = "Updated Child";
                leaf.status = Status.doing;
            });
        });

        // Verify the leaf was changed
        expect(model(hook).data.children?.[0].name).toBe("Updated Child");
        expect(model(hook).data.children?.[0].attributes?.status).toBe(Status.doing);

        // Verify forest.save was called
        expect(forest.load()).toEqual(tree);
    });

    it("does nothing when changing a leaf that doesn't exist", async () => {
        act(() => {
            model(hook).changeLeaf("nonexistent", (leaf: Leaf) => {
                leaf.name = "This won't work";
            });
        });

        expect(forest.load()).toEqual(tree);
        expect(model(hook).data).toEqual(expectedData);
    });

    it("transforms the tree into the correct format for react-d3-tree", async () => {
        expect(model(hook).data).toEqual(expectedData);
    });

    function arrangeTree() {
        // Create a root node with a child
        const rootNode = Leaf.createNull({
            name: "Root Node",
            id: "root123",
            status: Status.new
        });

        const childNode = Leaf.createNull({
            name: "Child Node",
            id: "child456",
            parent: rootNode,
            status: Status.new
        });

        rootNode.children = [childNode];
        tree = rootNode;
    }

    function model(hook: any) {
        const {result} = hook;
        return result.current;
    }

    const nodeDatum: TreeNodeDatum = {
        name: "Child Node",
        attributes: {
            id: "child456",
            status: Status.new
        },
        __rd3t: {
            id: "child456",
            depth: 1,
            collapsed: false
        }
    };

    const expectedData = {
        name: "Root Node",
        attributes: {
            id: "root123",
            status: Status.new
        },
        children: [
            {
                name: "Child Node",
                attributes: {
                    id: "child456",
                    status: Status.new
                },
                children: []
            }
        ]
    };
});