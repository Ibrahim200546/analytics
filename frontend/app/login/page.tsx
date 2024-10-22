'use client';

import React from "react";
import LoginForm from "@/libs/@dexodus/admin-constructor/src/LoginForm";
import {login} from "@/app/lib/actions/login";
import {useRouter} from "next/navigation";
import Button, {ButtonStyle} from "@/libs/@dexodus/bootstrap/UserInterface/Button";
import styles from './page.module.scss'
import {FaChevronLeft} from "react-icons/fa";

interface PageProps {
}

interface LoginData {
    login: string;
    password: string;
}

const Page: React.FC<PageProps> = () => {
    const router = useRouter();

    return (
        <>
            <Button style={ButtonStyle.Primary} bordered={true} className={styles.back} icon={<FaChevronLeft/>} onClick={() => router.push('/')}>
                Назад
            </Button>
            <LoginForm authenticate={async (loginData: any) => {
                const result = await login(loginData);

                if (result) {
                    return result;
                }

                router.push('/admin')
            }}/>
        </>
    )
}

export default Page;
