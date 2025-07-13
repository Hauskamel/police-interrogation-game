import { useState, useRef, useCallback, useEffect } from "react";

export function useDraggable(initialPosition = { x: 32, y: 32 }) {
    const [position, setPosition] = useState(initialPosition);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState(null);
    const ref = useRef();

    const onMouseMove = useCallback((e) => {
        if (!dragging || !offset) return;
        setPosition({
            x: e.pageX - offset.x,
            y: e.pageY - offset.y
        });
        e.stopPropagation();
        e.preventDefault();
    }, [dragging, offset]);

    const onMouseUp = useCallback((e) => {
        setDragging(false);
        e.stopPropagation();
        e.preventDefault();
    }, []);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }, [dragging, onMouseMove, onMouseUp]);

    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        const rect = ref.current.getBoundingClientRect();
        setDragging(true);
        setOffset({
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
        });
        e.stopPropagation();
        e.preventDefault();
    };

    return {
        ref,
        position,
        onMouseDown
    };
}