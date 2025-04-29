import {FirebaseRealtimeForest} from "./FirebaseRealtimeForest.ts";
import {Leaf, Status} from "../../Tree/core/leaf.ts";
import {expect} from "vitest";

describe('The Firebase forest', () => {

    describe('given no data found', () => {
        it('returns a default leaf', async () => {
            const subject = FirebaseRealtimeForest.createNull({data: null})
            const data = await subject.load()
            expect(data).toEqual(expect.objectContaining({
                name: "Goal",
                children: [],
                status: Status.new
            }))
        });

        it.todo('saves serialized tree', () => {
            let subject = FirebaseRealtimeForest.createNull({data: {}})
            subject.save(Leaf.createNull({name: "Like", id: "1234567890"}))
            // expect()
        });

    });
});
