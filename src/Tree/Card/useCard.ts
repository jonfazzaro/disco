import * as React from "react";
import {CardProps} from "./Card.tsx";
import {id} from "../node.ts";

export function useCard({node, changeLeaf}: CardProps) {
    return {
        onChangeName,
        blurOnEnter,
        selectAllText,
        truncate
    }

    function onChangeName(event: React.FormEvent<HTMLTextAreaElement>) {
        autoAdjustHeight(event);
        changeLeaf(id(node), l => l.name = event.currentTarget.value);
    }

    function autoAdjustHeight(event: React.FormEvent<HTMLTextAreaElement>) {
        event.currentTarget.style.height = "auto";
        event.currentTarget.style.height = event.currentTarget.scrollHeight + "px";
    }

    function blurOnEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter')
            event.currentTarget.blur();
    }
    
    function selectAllText(e: React.FocusEvent<HTMLTextAreaElement>) {
        e.currentTarget.select();
    }

    function truncate(str: string, maxLength: number = 30): string {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    }
}