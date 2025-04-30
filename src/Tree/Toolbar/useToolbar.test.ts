import {renderHook} from "@testing-library/react";
import {useToolbar} from "./useToolbar.ts";

describe('The toolbar', () => {
    it('is under test', () => {
        const {result} = renderHook(() => useToolbar());
        expect(result.current).toBeDefined()
    });

});