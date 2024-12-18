"use client";

import React from "react";
import Button, {ButtonProps} from "../../UserInterface/Button/Button";
import Link from "next/link";

interface LinkButtonProps extends ButtonProps {
    href: string;
    target?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({target, href, ...buttonProps}) => {
    return (
        <Link target={target} href={href}>
            <Button {...buttonProps}/>
        </Link>
    );
};

export default LinkButton;
