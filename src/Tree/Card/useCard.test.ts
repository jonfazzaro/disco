import {Leaf, Status} from "../core/leaf.ts";
import {renderHook} from "@testing-library/react";
import {useCard} from "./useCard.ts";

describe('The card hook', () => {
    beforeEach(() => {
        arrangeCallbackTools();
        arrangeHook();
    });

    it('changes name', () => {
        const event = createFormEvent("New Name");
        model(hook).onChangeName(event);
        lastChangeCallback?.(leaf);
        expect(lastChangedId).toEqual("1234567890");
    });

    it('blurs on enter key press', () => {
        const event = createKeyboardEvent("Enter");
        model(hook).blurOnEnter(event);
        expect(event.currentTarget.blur).toHaveBeenCalled();
    });

    it('selects all text on focus', () => {
        const event = createFocusEvent();
        model(hook).selectAllText(event);
        expect(event.currentTarget.select).toHaveBeenCalled();
    });

    let hook: any;
    let leaf: Leaf;
    let lastChangedId: string | null;
    let lastChangeCallback: ((leaf: Leaf) => void) | null;

    function arrangeCallbackTools() {
        lastChangedId = null;
        lastChangeCallback = null;
        leaf = Leaf.createNull({
            name: "Lord Mayor",
            id: "1234567890",
            status: Status.new
        });
    }

    function arrangeHook() {
        hook = renderHook(() =>
            useCard({node, changeLeaf: changeLeafFn, isSelected: false}));
    }

    function model(hook: any) {
        const {result} = hook;
        return result.current;
    }

    function changeLeafFn(id: string, callback: (leaf: any) => void) {
        lastChangedId = id;
        lastChangeCallback = callback;
    }

    function createFormEvent(value: string) {
        return {
            currentTarget: {
                value,
                style: {height: "0px"},
                scrollHeight: 100
            }
        } as React.FormEvent<HTMLTextAreaElement>;
    }

    function createKeyboardEvent(key: string) {
        return {
            key,
            currentTarget: {
                blur: vi.fn()
            }
        } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
    }

    function createFocusEvent() {
        return {
            currentTarget: {
                select: vi.fn()
            }
        } as unknown as React.FocusEvent<HTMLTextAreaElement>;
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