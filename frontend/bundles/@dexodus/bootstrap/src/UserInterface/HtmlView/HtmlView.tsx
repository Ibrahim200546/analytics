"use client";

import React, {useEffect, useRef} from "react";
import styles from "./HtmlView.module.scss";

interface HtmlViewProps {
    html?: string;
}

const HtmlView: React.FC<HtmlViewProps> = ({html = ''}) => {
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current && 'innerHTML' in divRef.current) {
            divRef.current.innerHTML = html;
        }
    })

    return (
        <div ref={divRef} className={styles.htmlView}>
        </div>
    );
};

export default HtmlView;
