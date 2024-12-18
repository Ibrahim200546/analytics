'use client'

import React, {useEffect} from "react";

interface PageGasketProps {
    title?: string;
    children: React.ReactNode;
}

const PageGasket: React.FC<PageGasketProps> = ({title = '', children}) => {
    useEffect(() => {
        const element = document.querySelector('.page-title');

        if (element) {
            element.innerHTML = title;
        }
    }, []);

    return children;
}

export default PageGasket
