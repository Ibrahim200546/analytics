"use client";

import React, {useState} from "react";
import Field from "@dexodus/react-form/src/fields/Field";
import Form, {FormData as FormState} from "@dexodus/react-form/src/Form";
import StringField from "@/bundles/@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import PasswordField from "@/bundles/@dexodus/bootstrap/src/UserInterface/Fields/PasswordField";
import Button, {ButtonStyle} from "@/bundles/@dexodus/bootstrap/src/UserInterface/Button";
import {FiLogIn} from "react-icons/fi";
import styles from './LoginForm.module.scss'

interface LoginFormProps {
    sign: (data: {login: string; password: string}) => Promise<string | null>;
}

const LoginForm: React.FC<LoginFormProps> = ({sign}) => {
    const [data, setData] = useState({login: '', password: ''});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const changeData = (nextData: FormState) => {
        setErrorMessage(null);

        return setData({
            login: typeof nextData.login === "string" ? nextData.login : "",
            password: typeof nextData.password === "string" ? nextData.password : "",
        });
    }

    const signIn = async () => {
        if (isSubmitting) {
            return;
        }

        try {
            setErrorMessage(null);
            setIsSubmitting(true);
            const message = await sign(data);

            if (message) {
                setErrorMessage(message);
            }
        } catch (error) {
            console.error("Sign-in request failed", error);
            setErrorMessage("Не удалось выполнить вход. Повторите попытку.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className={styles.formShell}
            onSubmit={(event) => {
                event.preventDefault();
                void signIn();
            }}
        >
            <Form data={data} setData={changeData} className={styles.loginForm}>
                <Field
                    component={StringField}
                    property="login"
                    label="Логин"
                    componentProps={{name: "username", autoComplete: "username", placeholder: "Введите логин"}}
                />
                <Field
                    component={PasswordField}
                    property="password"
                    label="Пароль"
                    componentProps={{name: "password", autoComplete: "current-password", placeholder: "Введите пароль"}}
                />
                {errorMessage && (
                    <p className={styles.error} role="alert" aria-live="polite">{errorMessage}</p>
                )}
                <div className={styles.buttons}>
                    <Button type="submit" style={ButtonStyle.Success} isLoading={isSubmitting} icon={<FiLogIn aria-hidden="true"/>}>
                        Войти
                    </Button>
                </div>
            </Form>
        </form>
    );
};

export default LoginForm;
