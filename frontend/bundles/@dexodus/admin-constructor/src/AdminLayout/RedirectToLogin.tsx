"use client";

import React from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

interface RedirectToLoginProps {
    children?: React.ReactNode;
}

const RedirectToLogin: React.FC<RedirectToLoginProps> = ({children}) => {
    const {status} = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/login')

        return <></>;
    } else {
        return (
            <>
                {children}
            </>
        );
    }
}

export default RedirectToLogin;
