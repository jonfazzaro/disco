import {TreeNodeDatum} from "react-d3-tree";
import {Leaf} from "./leaf.ts";
import * as React from "react";

export function useCard({nodeDatum, onChange}: {
    nodeDatum: TreeNodeDatum,
    onChange: (id: string, update: (leaf: Leaf) => void) => void
}) {
    return {
        onChangeName,
        blurOnEnter,
        truncate
    }

    function onChangeName(event: React.FormEvent<HTMLTextAreaElement>) {
        autoAdjustHeight(event);
        onChange(nodeDatum.attributes?.id as string, l => l.name = event.currentTarget.value);
    }

    function autoAdjustHeight(event: React.FormEvent<HTMLTextAreaElement>) {
        event.currentTarget.style.height = "auto";
        event.currentTarget.style.height = event.currentTarget.scrollHeight + "px";
    }

    function blurOnEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter')
            event.currentTarget.blur();
    }

    function truncate(str: string, maxLength: number = 30): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}