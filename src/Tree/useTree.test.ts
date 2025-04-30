import {act, renderHook, RenderHookResult} from "@testing-library/react";
import {TreeViewModel, useTree} from "./useTree.ts";
import {Leaf, Status} from "./core/leaf";
import {TreeNodeDatum} from "react-d3-tree";
import {FirebaseRealtimeForest} from "../Forest/Firebase/FirebaseRealtimeForest";
import {NullRealtimeDatabase} from "../Forest/Firebase/NullRealtimeDatabase.ts";
import {expect} from "vitest";

describe("The tree hook", () => {
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
            expect(model(hook).data).toEqual(loadedData);
        });

        describe('when selecting a leaf', () => {
            beforeEach(() => {
                act(() => {
                    model(hook).selectLeaf(nodeDatum);
                });
            });

            it("sets the selected ID", () => {
                expect(model(hook).selectedId).toBe("child456");
            });

            describe('and then pressing ESC', () => {
                beforeEach(() => {
                    pressEsc();
                });

                it("clears selection", () => {
                    expect(model(hook).selectedId).toBeNull();
                });
            });
        });

        describe('when changing a leaf', () => {

            describe("that doesn't exist", () => {
                it("does nothing", async () => {
                    await act(async () => {
                        await model(hook).changeLeaf("nonexistent", (leaf: Leaf) => {
                            leaf.name = "This won't work";
                        });
                    });

                    expect(model(hook).data).toEqual(loadedData);
                    expect(database.lastSavedData).not.toBeDefined()
                });
            });

            it.skip("updates the leaf", async () => {
                act(() => {
                    model(hook).changeLeaf("child456", (leaf: Leaf) => {
                        leaf.name = "Updated Child";
                        leaf.status = Status.doing;
                    });
                });

                // Verify the leaf was changed
                expect(model(hook).data.children).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        name: "Updated Child",
                        attributes: {
                            status: Status.doing
                        },
                    })
                ]));

                // Verify forest.save was called
                expect(forest.load()).toEqual(tree);
            });
        });

        const loadedData = expect.objectContaining({
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
        });
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

    function pressEsc() {
        act(() => {
            const escapeEvent = new KeyboardEvent('keydown', {key: 'Escape'});
            document.dispatchEvent(escapeEvent);
        });
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