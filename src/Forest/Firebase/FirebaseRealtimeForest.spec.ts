import { FirebaseRealtimeForest } from './FirebaseRealtimeForest.ts'
import { NullRealtimeDatabase } from './NullRealtimeDatabase.ts'
import { Leaf, SerializedLeaf, Status } from '../../Leaf/leaf.ts'

describe('The Firebase forest', () => {
    let subject: FirebaseRealtimeForest
    let database: NullRealtimeDatabase

    beforeEach(() => {
        database = new NullRealtimeDatabase(null)
        subject = FirebaseRealtimeForest.createNull(database)
    })

    it('returns a default leaf', async () => {
        const data = await subject.load()
        expect(data).toEqual(
            expect.objectContaining({
                name: 'Goal',
                children: [],
                status: Status.new,
            }),
        )
    })

    describe('given a saved tree', () => {
        const root = {
            name: 'Like',
            id: '1234567890',
            status: Status.doing,
        }

        beforeEach(async () => {
            await subject.save(Leaf.create(root) as Leaf)
        })

        it('saves a serialized root', async () => {
            const data = await subject.load()
            expect(data).toEqual(expect.objectContaining(root))
        })

        describe('given a callback', () => {
            let callbackData: SerializedLeaf | null = null
            let callback = function (data: SerializedLeaf) {
                callbackData = data
            }

            beforeEach(async () => {
                callbackData = null
                await subject.load(callback)
            })

            it("doesn't call it yet", async () => {
                expect(callbackData).toBeNull()
            })

            describe('given the value is updated', () => {
                const updated = {
                    name: 'Like',
                    id: '1234567890',
                    status: Status.done,
                    children: [],
                }

                beforeEach(() => {
                    database.onValueCallback?.(updated)
                })

                it('calls the callback with the new value', () => {
                    expect(callbackData).toEqual(Leaf.deserialize(updated))
                })
            })

            describe('that is not a function', () => {
                it('ignores it', async () => {
                    const pants = {} as any
                    await subject.load(pants)
                    database.onValueCallback?.({})
                })
            })
        })
    })
})
