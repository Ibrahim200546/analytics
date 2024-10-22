import {RefObject, useEffect} from "react";

const useOnClickInElements = (refs: RefObject<HTMLElement>[], onClick: () => void): void => {
    useEffect(() => {
        for (const ref of refs) {
            ref.current?.addEventListener('click', onClick);
        }

        return () => {
            for (const ref of refs) {
                ref.current?.removeEventListener('click', onClick);
            }
        }
    }, [refs, onClick]);
}

export default useOnClickInElements;
