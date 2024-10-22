'use client'

import React from "react";
import {revalidateTag} from "next/cache";

interface RevalidateButtonProps {
    tag: string;
    title: string;
}

const RevalidateButton: React.FC<RevalidateButtonProps> = ({tag, title = 'Revalidate'}) => {
    return (
        <button onClick={() => revalidateTag(tag)}>{title}</button>
    )
}

export default RevalidateButton;
