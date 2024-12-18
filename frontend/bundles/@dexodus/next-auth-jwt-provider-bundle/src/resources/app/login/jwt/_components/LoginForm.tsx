"use client";

import React, {useState} from "react";
import {Field, Form} from "@dexodus/react-form";
import StringField from "@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import PasswordField from "@dexodus/bootstrap/src/UserInterface/Fields/PasswordField";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import styles from './LoginForm.module.scss'

interface LoginFormProps {
    sign: (data: {login: string; password: string}) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({sign}) => {
    const [data, setData] = useState({login: '', password: ''});
    const [haveError, setHaveError] = useState<boolean>(false);

    const changeData = (data: any) => {
        setHaveError(false);

        return setData(data);
    }

    const signIn = async () => {
        try {
            setHaveError(false);
            await sign(data);
        } catch (error) {
            setHaveError(true);
            console.log(error);
        }
    }

    return (
        <Form data={data} setData={changeData} className={styles.loginForm}>
            <Field component={StringField} property="login" label="Логин"/>
            <Field component={PasswordField} property="password" label="Пароль"/>
            {haveError && (
                <p className={styles.error}>Неправильный логин или пароль</p>
            )}
            <div className={styles.buttons}>
                <Button style={ButtonStyle.Success} onClick={() => signIn().then()}>
                    Войти
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;
