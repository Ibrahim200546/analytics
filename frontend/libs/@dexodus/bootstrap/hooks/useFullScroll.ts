import {RefObject, useEffect} from "react";

export const useFullScroll = (ref: RefObject<HTMLElement>, callback: () => void): void => {
    const scroll = (event: Event) => {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }

        if (Math.abs(event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) <= 1) {
            callback();
        }
    }

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        ref.current.addEventListener('scroll', scroll);

        return () => {
            ref.current?.removeEventListener('scroll', scroll)
        }
    }, [scroll]);
}
