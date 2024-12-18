import styles from "./page.module.scss";
import LoginForm from "./_components/LoginForm";
import React from "react";
import Link from "next/link";
import {signIn} from "@/auth";

const Page = () => {
    const sign = async (data: {login: string; password: string}) => {
        'use server'
        await signIn('credentials', data);
    }

    return (
        <div className={styles.page}>
            <div className={styles.loginWindow}>
                Войти в систему используя почту и пароль

                <LoginForm sign={sign}/>
                <Link href="/login">Назад</Link>
            </div>
        </div>
    )
}

export default Page;
