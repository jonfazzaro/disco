import {Leaf} from "./leaf.ts";
import {expect} from "vitest";

describe('The leaf', () => {
    let leaf: Leaf, parent: Leaf, sibling: Leaf;

    beforeEach(() => {
        parent = new Leaf();
        leaf = new Leaf(parent);
        sibling = new Leaf(parent);
    });

    it('has a parent', () => {
        expect(leaf.parent).toEqual(parent);
    });

    it('has a status', () => {
        expect(leaf.status).toEqual('new')
    });

    it('lists its children', () => {
        expect(parent.children[0]).toEqual(leaf);   
    });

    describe('when setting status', () => {
        describe('to doing', () => {
            beforeEach(() => {
                leaf.status = 'doing';
            });
                
            it('sets the status', () => {
                expect(leaf.status).toEqual('doing');
            });

            it("sets the parent's status", () => {
                expect(parent.status).toEqual('doing');
            });
        });

        describe('to done', () => {
            beforeEach(() => {
                leaf.status = 'doing';
                leaf.status = 'done';
            });

            it("does not change the parent's status", () => {
                expect(parent.status).toEqual('doing');
            });

            describe('when the sibling is done', () => {
                beforeEach(() => {
                    sibling.status = 'doing'
                    sibling.status = 'done'
                });
                
                it('sets the parent to done', () => {
                    expect(parent.status).toEqual('done');
                });

                describe('then back to doing', () => {
                    beforeEach(() => {
                        sibling.status = 'doing'
                    });

                    it('sets the parent to doing', () => {
                        expect(parent.status).toEqual('doing');
                    }); 
                });
            });

            describe('all back to new', () => {
                beforeEach(() => {
                    leaf.status = 'new'
                    sibling.status = 'new'
                });

                it('sets the parent to new', () => {
                    expect(parent.status).toEqual('new');
                });
            });
        });

        describe('to canceled', () => {
            beforeEach(() => {
                leaf.status = 'doing'
                leaf.status = 'canceled'
            });
            
            it('sets the parent to new', () => {
                expect(parent.status).toEqual('new');
            });

            describe('when a sibling is doing', () => {
                beforeEach(() => {
                    sibling.status = 'doing'
                });

                it('sets the parent to doing', () => {
                    expect(parent.status).toEqual('doing');
                }); 
            });

            describe('when siblings are done', () => {
                beforeEach(() => {
                    sibling.status = 'done'
                });

                it('sets the parent to done', () => {
                    expect(parent.status).toEqual('done');
                });
            });
        });
    });
});