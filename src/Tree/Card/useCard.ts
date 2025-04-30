import * as React from "react";
import {CardProps} from "./Card.tsx";
import {id} from "../node.ts";
import {useEffect, useRef} from "react";

export function useCard({node, changeLeaf}: CardProps) {
    const nameRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        // if (nameRef.current) 
        //     autoAdjustHeight(nameRef.current);
    })
    
    return {
        // nameRef,
        // onChangeName,
        // blurOnEnter,
        // selectAllText,
    }

    function onChangeName(event: React.FormEvent<HTMLTextAreaElement>) {
        // autoAdjustHeight(event.currentTarget);
        // changeLeaf(id(node), l => l.name = event.currentTarget.value);
    }

    function autoAdjustHeight(element: HTMLTextAreaElement) {
        // element.style.height = "auto";
        // element.style.height = element.scrollHeight + "px";
    }

    function blurOnEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        // if (event.key === 'Enter')
        //     event.currentTarget.blur();
    }
    
    function selectAllText(e: React.FocusEvent<HTMLTextAreaElement>) {
        // e.currentTarget.select();
    }
}