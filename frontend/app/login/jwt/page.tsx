import styles from "./page.module.scss";
import LoginForm from "./_components/LoginForm";
import React from "react";
import Link from "next/link";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {FiArrowLeft, FiLock} from "react-icons/fi";

const Page = () => {
    const sign = async (data: {login: string; password: string}): Promise<string | null> => {
        'use server'

        try {
            await signIn('credentials', data);
            return null;
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }

            if (error instanceof AuthError) {
                if (error.type === "CredentialsSignin") {
                    return "Проверьте логин и пароль.";
                }

                console.error("JWT sign-in failed", {type: error.type});
                return "Сервис авторизации временно недоступен. Повторите попытку позже.";
            }

            console.error("Unexpected JWT sign-in error", error);
            return "Не удалось выполнить вход. Повторите попытку.";
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.loginWindow} aria-labelledby="jwt-login-title">
                <div className={styles.heading}>
                    <div className={styles.lockIcon}><FiLock aria-hidden="true"/></div>
                    <p className={styles.eyebrow}>ISMI / защищённый вход</p>
                    <h1 id="jwt-login-title">Введите данные доступа</h1>
                    <p className={styles.description}>Используйте логин и пароль, выданные администратором системы.</p>
                </div>
                <LoginForm sign={sign}/>
                <Link className={styles.backLink} href="/login">
                    <FiArrowLeft aria-hidden="true"/>
                    <span>Назад к выбору входа</span>
                </Link>
            </section>
        </main>
    )
}

export default Page;
