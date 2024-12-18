import {ReactNode, useEffect, useRef, useState} from "react";
import styles from "./useVerticalCarousel.module.scss";

export enum VerticalCarouseScrollDirection {
    NONE = 0,
    UP = 1,
    DOWN = -1,
}

export enum CubicBezier {
    LINEAR = 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
    EASE_IN_OUT = 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
}

export const useVerticalCarousel = (animationDurationMs: number, cubicBezier: string = CubicBezier.EASE_IN_OUT) => {
    const [scrollDirection, setScrollDirection] = useState<VerticalCarouseScrollDirection>(VerticalCarouseScrollDirection.NONE);
    const [scrollElement, setScrollElement] = useState<ReactNode | null>(null);
    const [currentElement, setCurrentElement] = useState<ReactNode | null>(null);
    const [scrollFinishCallback, setScrollFinishCallback] = useState<null | (() => void)>(null)
    const isScrolling = scrollDirection !== VerticalCarouseScrollDirection.NONE;

    const carouselRef = useRef<HTMLDivElement>(null);
    const previousElementRef = useRef<HTMLDivElement>(null);
    const currentElementRef = useRef<HTMLDivElement>(null);
    const nextElementRef = useRef<HTMLDivElement>(null);

    const scroll = (newElement: ReactNode, direction: VerticalCarouseScrollDirection.UP | VerticalCarouseScrollDirection.DOWN, finishCallback: (() => void) | null = null) => {
        if (!isScrolling) {
            setScrollDirection(direction);
            setScrollElement(newElement);
            setScrollFinishCallback(() => finishCallback);
        }
    }

    useEffect(() => {
        if (currentElement !== null && carouselRef.current && currentElementRef.current && previousElementRef.current) {
            const currentElementHeight = currentElementRef.current.clientHeight;
            carouselRef.current.style.maxHeight = `${currentElementHeight}px`;
        }
    }, [currentElement, currentElementRef.current === null]);

    useEffect(() => {
        if (previousElementRef.current?.children.length) {
            previousElementRef.current.style.marginTop = `-${previousElementRef.current.clientHeight}px`;
            setTimeout(() => {
                if (previousElementRef.current && carouselRef.current) {
                    previousElementRef.current.style.transition = `all ${animationDurationMs}ms ${cubicBezier}`;
                    previousElementRef.current.style.marginTop = '0px';
                    carouselRef.current.style.transition = `all ${animationDurationMs}ms ${cubicBezier}`;
                    carouselRef.current.style.maxHeight = `${previousElementRef.current.clientHeight}px`

                    setTimeout(() => {
                        if (previousElementRef.current && carouselRef.current) {
                            previousElementRef.current.style.transition = 'unset';
                            carouselRef.current.style.transition = `unset`;
                        }
                        setScrollDirection(VerticalCarouseScrollDirection.NONE);
                        setCurrentElement(scrollElement);
                        setScrollElement(null);
                        if (typeof scrollFinishCallback === 'function') {
                            scrollFinishCallback();
                        }
                        setScrollFinishCallback(null);
                    }, animationDurationMs);
                }
            });
        }

        if (nextElementRef.current?.children.length) {
            if (currentElementRef.current && carouselRef.current) {
                currentElementRef.current.style.transition = `all ${animationDurationMs}ms ${cubicBezier}`;
                currentElementRef.current.style.marginTop = `-${currentElementRef.current.clientHeight}px`;
                carouselRef.current.style.transition = `all ${animationDurationMs}ms ${cubicBezier}`;
                carouselRef.current.style.maxHeight = `${nextElementRef.current.clientHeight}px`

                setTimeout(() => {
                    if (currentElementRef.current && carouselRef.current) {
                        currentElementRef.current.style.transition = 'unset';
                        currentElementRef.current.style.marginTop = `unset`;
                        carouselRef.current.style.transition = `unset`;
                    }
                    setScrollDirection(VerticalCarouseScrollDirection.NONE);
                    setCurrentElement(scrollElement);
                    setScrollElement(null);
                    if (typeof scrollFinishCallback === 'function') {
                        scrollFinishCallback();
                    }
                    setScrollFinishCallback(null);
                }, animationDurationMs);
            }
        }
    }, [scrollElement === null]);

    return {
        setCurrentElement: (element: ReactNode) => {
            setCurrentElement(element);
        },
        carousel: (
            <div className={styles.verticalCarousel} ref={carouselRef}>
                <div ref={previousElementRef}>
                    {scrollDirection === VerticalCarouseScrollDirection.UP && scrollElement}
                </div>
                <div ref={currentElementRef}>
                    {currentElement}
                </div>
                <div ref={nextElementRef}>
                    {scrollDirection === VerticalCarouseScrollDirection.DOWN && scrollElement}
                </div>
            </div>
        ),
        carouselRef,
        scrollUp: (newElement: ReactNode, finishCallback: (() => void) | null = null) => {
            scroll(newElement, VerticalCarouseScrollDirection.UP, finishCallback);
        },
        scrollDown: (newElement: ReactNode, finishCallback: (() => void) | null = null) => {
            scroll(newElement, VerticalCarouseScrollDirection.DOWN, finishCallback);
        },
        isScrolling,
    }
}
