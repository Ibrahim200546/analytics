import {useEffect, useState} from "react";

export const useOnValueChange = (value: any, timeoutMs: number, callback: () => void) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        const timerId = setTimeout(() => {
            callback();
            setTimeoutId(null);
        }, timeoutMs);
        setTimeoutId(timerId);

        return () => {
            clearTimeout(timerId);
        }
    }, [value, timeoutMs]);

    return {isTimeoutWaiting: timeoutId !== null}
}
