import {MouseEventHandler, RefObject, useEffect} from "react";

const useOnClickInDocument = (refs: RefObject<HTMLElement>[], onClick: () => void) => {
    useEffect(() => {
        const click: MouseEventHandler = (event) => {
            let parent: Element | null = event.target as any;

            while (parent) {
                for (const ref of refs) {
                    if (parent === ref.current || parent === null) {
                        return;
                    }
                }

                parent = parent.parentElement;
            }

            onClick();
        }

        document.addEventListener("click", click as any)

        return () => document.removeEventListener("click", click as any);
    }, []);
}

export default useOnClickInDocument;
