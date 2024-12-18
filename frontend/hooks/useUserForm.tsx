import useForm from "@dexodus/react-form/src/hooks/useForm";
import {Field} from "@dexodus/react-form";
import StringField from "@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import notBlank from "@dexodus/react-form/src/validators/notBlank";
import emailValidator from "@dexodus/react-form/src/validators/emailValidator";
import Button, {ButtonSizes, ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import PasswordField from "@dexodus/bootstrap/src/UserInterface/Fields/PasswordField";
import stringMinLength from "@dexodus/react-form/src/validators/stringMinLength";
import stringMinLengthOrBlank from "@dexodus/react-form/src/validators/stringMinLengthOrBlank";
import {generatePassword} from "@dexodus/bootstrap/src/common/password";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import React, {RefObject, useEffect, useState} from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {Jsel} from "@dexodus/jsel";
import styles from "./useUserForm.module.scss"
import "./useUserForm.css";

export interface UserFormOptions {
    modalHeader?: React.ReactNode;
    actionAfterSaving?: (() => void) | (() => Promise<void>);
    saveUrl: string;
    toastWhenSaved?: string;
    toastWhenSaveFailed?: string;
}

export interface UseUserFormReturn {
    form: React.ReactNode;
    show: () => void;
    hide: () => void;
    loading: boolean;
    jselRef: RefObject<Jsel>;
}

export const createEmptyUser = () => {
    return {
        lastName: "",
        firstName: "",
        patronymic: "",
        iin: "",
        email: "",
        plainPassword: "",
    };
};

const useUserForm = (mode: "create" | "edit", options: UserFormOptions): UseUserFormReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const apiFetch = useApiFetch();

    const {component, validate, data, jselRef} = useForm(jselRef => (
        <>
            <div className={styles.formInlineThreeFields}>
                <Field
                    component={StringField}
                    property="lastName"
                    label="Фамилия"
                    validators={[notBlank("Поле должно быть заполнено")]}
                />
                <Field
                    component={StringField}
                    property="firstName"
                    label="Имя"
                    validators={[notBlank("Поле должно быть заполнено")]}
                />
                <Field
                    component={StringField}
                    property="patronymic"
                    label="Отчество"
                    validators={[notBlank("Поле должно быть заполнено")]}
                />
            </div>
            <Field
                component={StringField}
                property="iin"
                label="ИИН"
                componentProps={{mask: "############"}}
                validators={[notBlank("Поле должно быть заполнено")]}
            />
            <Field
                component={StringField}
                property="email"
                label="Почта"
                validators={[notBlank("Поле должно быть заполнено"), emailValidator("Не правильный формат почты")]}
            />
            {jselRef.current?.exec("data.iin")?.length === 12 && (
                <Button
                    className={styles.underField}
                    style={ButtonStyle.Info}
                    size={ButtonSizes.ExtraSmall}
                    rounded={true}
                    bordered={true}
                    onClick={() => {
                        jselRef.current?.assign("data.email", `${jselRef.current?.exec("data.iin")}@smi.kz`);
                    }}
                >
                    Сгенерировать системную почту
                </Button>
            )}
            <Field
                component={PasswordField}
                property="plainPassword"
                label="Пароль"
                validators={mode === "create" ? [notBlank("Поле должно быть заполнено"), stringMinLength(6, "Минимальная длина пароля 6 символов")] : [stringMinLengthOrBlank(6, "Минимальная длина пароля 6 символов")]}
            />
            <Button
                className={styles.underField}
                style={ButtonStyle.Info}
                size={ButtonSizes.ExtraSmall}
                rounded={true}
                bordered={true}
                onClick={() => {
                    jselRef.current?.assign("data.plainPassword", generatePassword(8));
                }}
            >
                Сгенерировать случайный пароль
            </Button>
            {mode === "edit" && jselRef.current?.exec("data.plainPassword").length === 0 && (
                <h6 className="secondary-color">Пароль останется прежним</h6>
            )}
        </>
    ), createEmptyUser());

    const {modal, show, hide} = useModal((
        <div>
            {component}
        </div>
    ), (
        <h2>
            {options.modalHeader}
        </h2>
    ), ({close}) => (
        <div className={styles.controls}>
            <Button
                isLoading={loading}
                className={styles.control}
                style={ButtonStyle.Success}
                onClick={() => validate(async () => {
                    setLoading(true);
                    hide();
                    const createResponse = await apiFetch(options.saveUrl, {
                        method: mode === "create" ? "POST" : "PUT",
                        body: JSON.stringify({
                            ...data,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (createResponse.ok) {
                        toast(options.toastWhenSaved, {type: "success"});
                        if (options.actionAfterSaving) {
                            const result = options.actionAfterSaving();

                            if (result instanceof Promise) {
                                await result;
                            }
                        }
                    } else {
                        toast(options.toastWhenSaveFailed, {type: "error"});
                    }
                    setLoading(false);
                })}
            >
                {mode === "create" ? "Создать" : "Изменить"}
            </Button>
            <Button className={styles.control} onClick={close} isLoading={loading}>Закрыть</Button>
        </div>
    ), ModalSize.Large);

    useEffect(() => {
        if (mode === 'create') {
            jselRef.current?.assign('data', createEmptyUser());
        }
    }, []);

    return {
        form: modal,
        show,
        hide,
        loading,
        jselRef,
    }
};

export default useUserForm;
