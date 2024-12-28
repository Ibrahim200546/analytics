"use client";

import React, {useEffect, useRef} from "react";

interface ArticleImageProps {
    imageUrl?: string;
    className?: string;
}

const isHTMLImageElement = (current: HTMLImageElement | null): current is HTMLImageElement => {
    return !!current;
}

const ArticleImage: React.FC<ArticleImageProps> = ({imageUrl, className}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);

    const loadDefaultImage = () => {
        if (isHTMLImageElement(imageRef.current)) {
            imageRef.current.src = '/images/empty_news.jpg';
        }
    }

    useEffect(() => {
        if (isHTMLImageElement(imageRef.current)) {
            imageRef.current.addEventListener('error', loadDefaultImage);
        }

        return () => {
            if (isHTMLImageElement(imageRef.current)) {
                imageRef.current.removeEventListener('error', loadDefaultImage);
            }
        }
    }, [imageRef.current]);

    return (
        <div>
            {
                imageUrl ? (
                    <img ref={imageRef} src={imageUrl} alt={imageUrl} className={className}/>
                ) : (
                    <img src={"/images/empty_news.jpg"} alt={"empty_news"} className={className}/>
                )
            }
        </div>
    );
};

export default ArticleImage;
