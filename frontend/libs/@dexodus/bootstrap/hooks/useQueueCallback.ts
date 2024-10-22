import {useEffect, useState} from "react";

type CallbackType = (() => void) | Promise<void>;

export const useQueueCallback = () => {
    const [queue, setQueue] = useState<CallbackType[]>([]);
    const [currentCallback, setCurrentCallback] = useState<CallbackType | null>(null);

    useEffect(() => {
        if (currentCallback !== null) {
            if (currentCallback instanceof Promise) {
                currentCallback.then(() => {
                    setCurrentCallback(null);
                })
            } else {
                currentCallback();
                setCurrentCallback(null);
            }

            return;
        }

        if (queue.length === 0) {
            return;
        }

        setCurrentCallback(() => queue[0]);
        setQueue(() => queue.slice(1));
    }, [queue, currentCallback]);

    return {
        push: (callback: CallbackType) => {
            setQueue(queue => [...queue, callback]);
        },
        next: (callback: CallbackType) => {
            setQueue(() => [callback]);
        },
        isRunning: queue.length > 0 || currentCallback !== null,
    }
}
