import {Leaf, Status} from "./leaf.ts";
import {expect} from "vitest";

describe('The leaf', () => {
    let leaf: Leaf, parent: Leaf, sibling: Leaf, grandchild: Leaf;

    beforeEach(() => {
        parent = new Leaf("Clean the house");
        leaf = new Leaf("dishes",  parent);
        sibling = new Leaf("do the laundry",  parent);
        grandchild = new Leaf("separate delicates", leaf);
    });

    it('has a parent', () => {
        expect(leaf.parent).toEqual(parent);
    });

    it('has a status', () => {
        expect(leaf.status).toEqual(Status.new)
    });

    it('lists its children', () => {
        expect(parent.children[0]).toEqual(leaf);
    });

    it('lists its name and status', () => {
        expect(`${leaf}`).toEqual("dishes (new)");
    });

    describe('when setting status', () => {
        describe('to doing', () => {
            beforeEach(() => {
                leaf.status = Status.doing;
            });

            it('sets the status', () => {
                expect(leaf.status).toEqual(Status.doing);
            });

            it("sets the parent's status", () => {
                expect(parent.status).toEqual(Status.doing);
            });
        });

        describe('to done', () => {
            beforeEach(() => {
                sibling.status = Status.new;
                leaf.status = Status.doing;
                leaf.status = Status.done;
            });

            it("does not change the parent's status", () => {
                expect(parent.status).toEqual(Status.doing);
            });

            describe('when the sibling is done', () => {
                beforeEach(() => {
                    sibling.status = Status.doing
                    sibling.status = Status.done
                });

                it('sets the parent to done', () => {
                    expect(parent.status).toEqual(Status.done);
                });

                describe('then back to doing', () => {
                    beforeEach(() => {
                        sibling.status = Status.doing
                    });

                    it('sets the parent to doing', () => {
                        expect(parent.status).toEqual(Status.doing);
                    });
                });
            });

            describe('all back to new', () => {
                beforeEach(() => {
                    leaf.status = Status.new
                    sibling.status = Status.new
                });

                it('sets the parent to new', () => {
                    expect(parent.status).toEqual(Status.new);
                });
            });
        });

        describe('to canceled', () => {
            beforeEach(() => {
                leaf.status = Status.doing
                leaf.status = Status.canceled
            });

            it("does not change the parent's status", () => {
                expect(parent.status).toEqual(Status.doing);
            });

            describe('when a sibling is doing', () => {
                beforeEach(() => {
                    sibling.status = Status.doing
                });

                it('sets the parent to doing', () => {
                    expect(parent.status).toEqual(Status.doing);
                });
            });

            describe('when siblings are done', () => {
                beforeEach(() => {
                    sibling.status = Status.done
                });

                it('sets the parent to done', () => {
                    expect(parent.status).toEqual(Status.done);
                });
            });
        });

        describe('of the grandchild', () => {
            it('gets propagated all the way up', () => {
                grandchild.status = Status.doing
                expect(leaf.status).toEqual(Status.doing);
                expect(parent.status).toEqual(Status.doing);
            });

        });

        describe('of the parent', () => {
            describe('to done', () => {
                beforeEach(() => {
                    leaf.status = Status.doing;
                    parent.status = Status.doing;
                    parent.status = Status.done;
                });

                it('sets all the doing children to done', () => {
                    expect(leaf.status).toEqual(Status.done);
                });

                it('sets all the new children to canceled', () => {
                    expect(sibling.status).toEqual(Status.canceled);
                });
            });
            
        });
    });
});