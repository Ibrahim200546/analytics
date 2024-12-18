"use client";

import React from "react";
import Next13ProgressBar from "next13-progressbar";

interface PageLoadingProgressbarProps {
}

const PageLoadingProgressbar: React.FC<PageLoadingProgressbarProps> = ({}) => {
    return (
        <>
            <Next13ProgressBar height="4px" color="#0A2FFF" options={{ showSpinner: true }} showOnShallow />
        </>
    );
};

export default PageLoadingProgressbar;
