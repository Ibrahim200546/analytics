"use client";

import React, {useEffect, useState} from "react";
import {Field, Form} from "@/libs/@dexodus/react-form";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import styles from "./LoginForm.module.scss";
import StringField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/StringField";
import Button, {ButtonStyle} from "@/libs/@dexodus/bootstrap/UserInterface/Button";
import {useSearchParams} from "next/navigation";
import IconMail from "@/icons/IconMail";
import IconPassword from "@/icons/IconPassword";
import PasswordField from "@/libs/@dexodus/bootstrap/UserInterface/Fields/PasswordField";
import {TailSpin} from "react-loader-spinner";

interface LoginFormProps {
    authenticate: any;
}

export interface LoginData {
    login: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({authenticate}) => {
    const search = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [loginData, setLoginData] = useState<any>({login: search.get('userIdentifier') ?? '', password: ''});
    const [errorMessage, setErrorMessage] = useState();
    const login = () => {
        if (loading) {
            return;
        }

        (async () => {
            setLoading(true);
            setErrorMessage(await authenticate(loginData));
            setLoading(false);
        })()
    }

    useEffect(() => {
        setErrorMessage(undefined);
    }, [loginData]);

    return (
        <div className={styles.loginForm}>
            <div className={styles.window}>
                <h1 className={styles.title}>Войти</h1>
                <p className={styles.description}>Войдите в личный кабинет чтобы продолжать</p>
                <Form data={loginData} setData={setLoginData} className={styles.form}>
                    <Field component={StringField} property="login" label="Электронная почта" componentProps={{icon: <IconMail/>, placeholder: 'Введите электронную почту'}}/>
                    <Field component={PasswordField} property="password" label="Пароль" componentProps={{icon: <IconPassword/>, placeholder: 'Введите пароль'}}/>
                </Form>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                <div className={styles.buttonsRow}>
                    <Button style={ButtonStyle.Primary} onClick={login} className={styles.login}>
                        {loading && <TailSpin width={24} height={24} color="white"/>}
                        {!loading && <TextTranslation label="login.autrorize" defaultValue="Войти"/>}
                    </Button>
                </div>
                <p className={styles.allRightsReserved}>All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginForm;
