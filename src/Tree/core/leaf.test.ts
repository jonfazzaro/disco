import { Leaf, SerializedLeaf, Status } from './leaf.ts'
import { expect } from 'vitest'

describe('The leaf', () => {
    let leaf: Leaf, parent: Leaf, sibling: Leaf, grandchild: Leaf, cousin: Leaf

    beforeEach(() => {
        arrangeLeaves()
    })

    it('has an ID', () => {
        expect(leaf.id).toEqual('2f9fc7e0-6c0d-4d6c-b682-7f8e31d0d41e')
    })

    it('has a parent', () => {
        expect(leaf.parent).toEqual(parent)
    })

    it('has a status', () => {
        expect(leaf.status).toEqual(Status.new)
        expect(cousin.status).toEqual(Status.doing)
    })

    it('lists its children', () => {
        expect(parent.children[0]).toEqual(leaf)
    })

    it('lists its name and status', () => {
        expect(`${leaf}`).toEqual('dishes (new)')
    })

    describe('when setting status', () => {
        describe('to doing', () => {
            beforeEach(() => {
                leaf.status = Status.doing
            })

            it('sets the status', () => {
                expect(leaf.status).toEqual(Status.doing)
            })

            it("sets the parent's status", () => {
                expect(parent.status).toEqual(Status.doing)
            })
        })

        describe('to blocked', () => {
            beforeEach(() => {
                leaf.status = Status.blocked
            })

            it('sets the status', () => {
                expect(leaf.status).toEqual(Status.blocked)
            })

            it("sets the parent's status", () => {
                expect(parent.status).toEqual(Status.blocked)
            })
        })

        describe('to done', () => {
            beforeEach(() => {
                sibling.status = Status.new
                leaf.status = Status.doing
                leaf.status = Status.done
            })

            it("does not change the parent's status", () => {
                expect(parent.status).toEqual(Status.doing)
            })

            describe('when the sibling is done', () => {
                beforeEach(() => {
                    sibling.status = Status.doing
                    sibling.status = Status.done
                })

                it('sets the parent to done', () => {
                    expect(parent.status).toEqual(Status.done)
                })

                describe('then back to doing', () => {
                    beforeEach(() => {
                        sibling.status = Status.doing
                    })

                    it('sets the parent to doing', () => {
                        expect(parent.status).toEqual(Status.doing)
                    })
                })
            })

            describe('all back to new', () => {
                beforeEach(() => {
                    leaf.status = Status.new
                    sibling.status = Status.new
                })

                it('sets the parent to new', () => {
                    expect(parent.status).toEqual(Status.new)
                })
            })
        })

        describe('to canceled', () => {
            beforeEach(() => {
                leaf.status = Status.doing
                leaf.status = Status.canceled
            })

            it("does not change the parent's status", () => {
                expect(parent.status).toEqual(Status.doing)
            })

            it('cancels the children', () => {
                expect(grandchild.status).toEqual(Status.canceled)
                expect(cousin.status).toEqual(Status.canceled)
            })

            describe('when a sibling is doing', () => {
                beforeEach(() => {
                    sibling.status = Status.doing
                })

                it('sets the parent to doing', () => {
                    expect(parent.status).toEqual(Status.doing)
                })
            })

            describe('when siblings are done', () => {
                beforeEach(() => {
                    sibling.status = Status.done
                })

                it('sets the parent to done', () => {
                    expect(parent.status).toEqual(Status.done)
                })
            })
        })

        describe('of the grandchild', () => {
            it('gets propagated all the way up', () => {
                grandchild.status = Status.doing
                expect(leaf.status).toEqual(Status.doing)
                expect(parent.status).toEqual(Status.doing)
            })
        })

        describe('of the parent', () => {
            describe('to done', () => {
                beforeEach(() => {
                    leaf.status = Status.doing
                    parent.status = Status.doing
                    parent.status = Status.done
                })

                it('sets all the doing children to done', () => {
                    expect(leaf.status).toEqual(Status.done)
                })

                it('sets all the new children to canceled', () => {
                    expect(sibling.status).toEqual(Status.canceled)
                })
            })
        })
    })

    describe('when deleting', () => {
        beforeEach(() => {
            grandchild.status = Status.done
            cousin.delete()
        })

        it('no longer has a parent', () => {
            expect(cousin.parent).toBeNull()
            expect(leaf.children).not.toContain(cousin)
        })

        it('propagates status as if it was canceled', () => {
            expect(leaf.status).toEqual(Status.done)
        })
    })

    describe('when serializing', () => {
        let serialized: SerializedLeaf

        beforeEach(() => {
            serialized = parent.serialize()
        })

        it('returns a tree of serialize leaves', () => {
            expect(serialized).toEqual({
                children: [
                    {
                        children: [
                            {
                                children: [],
                                id: 'ba3de1d3-3ab0-4934-aea4-3fcc719ef174',
                                name: 'separate delicates',
                                status: 'new',
                            },
                            {
                                children: [],
                                id: 'fa3de1d3-3ab0-4934-aea4-3fcc719ef174',
                                name: 'separate colors',
                                status: 'doing',
                            },
                        ],
                        id: '2f9fc7e0-6c0d-4d6c-b682-7f8e31d0d41e',
                        name: 'dishes',
                        status: 'new',
                    },
                    {
                        children: [],
                        id: '6985e31c-2cd1-492d-be57-96a295869d8a',
                        name: 'do the laundry',
                        status: 'new',
                    },
                ],
                id: 'c9d6431d-6166-4ec3-9485-0db974753299',
                name: 'Clean the house',
                status: 'new',
            })
        })

        describe('and deserializing', () => {
            it('rehydrates the tree', () => {
                expect(Leaf.deserialize(serialized)).toEqual(parent)
            })

            describe('given no children attribute', () => {
                it('makes an empty one', () => {
                    const cereal = {
                        id: 'c9d6431d-6166-4ec3-9485-0db974753299',
                        name: 'Clean the house',
                        status: 'new',
                    }

                    const expected = Leaf.create({
                        id: 'c9d6431d-6166-4ec3-9485-0db974753299',
                        name: 'Clean the house',
                        status: Status.new,
                        parent: null,
                    })

                    // @ts-ignore
                    expect(Leaf.deserialize(cereal)).toEqual(expected)
                })
            })
        })
    })

    function arrangeLeaves() {
        parent = Leaf.create({
            name: 'Clean the house',
            id: 'c9d6431d-6166-4ec3-9485-0db974753299',
        })
        leaf = Leaf.create({
            name: 'dishes',
            parent,
            id: '2f9fc7e0-6c0d-4d6c-b682-7f8e31d0d41e',
        })
        sibling = Leaf.create({
            name: 'do the laundry',
            parent,
            id: '6985e31c-2cd1-492d-be57-96a295869d8a',
        })
        grandchild = Leaf.create({
            name: 'separate delicates',
            parent: leaf,
            id: 'ba3de1d3-3ab0-4934-aea4-3fcc719ef174',
        })
        cousin = Leaf.create({
            name: 'separate colors',
            parent: leaf,
            status: Status.doing,
            id: 'fa3de1d3-3ab0-4934-aea4-3fcc719ef174',
        })
    }
})
