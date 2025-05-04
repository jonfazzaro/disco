import { KeyMaster } from './KeyMaster.ts'

describe('The Keymaster', () => {
    let subject: KeyMaster

    it('creates and goes to a new tree', () => {
        subject = KeyMaster.createNull({ currentPath: '/', nextId: '333' })
        subject.newTree()
        expect(subject.key()).toEqual('333')
    })

    describe('given a key in the URL', () => {
        it('returns that key', () => {
            subject = KeyMaster.createNull({ currentPath: '/1234567890', nextId: '987654321' })
            expect(subject.key()).toEqual('1234567890')
        })
    })

    describe('given no key in the URL', () => {
        beforeEach(() => {
            subject = KeyMaster.createNull({ currentPath: '/', nextId: '987654321' })
        })

        it('creates a new key and forwards to it', () => {
            expect(subject.key()).toEqual('987654321')
        })
    })
})
