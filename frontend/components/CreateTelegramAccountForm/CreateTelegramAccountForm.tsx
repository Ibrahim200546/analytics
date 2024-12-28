"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./CreateTelegramAccountForm.module.scss";
import TelegramAccount_Create from "@/apiTypes/Dexodus/TelegramParserBundle/Entity/TelegramAccount_Create";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import responseIsNotOkSendError from "@dexodus/api-fetch/src/responseIsNotOkSendError";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import {TailSpin} from "react-loader-spinner";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import useEntityForm from "@dexodus/entity-form/src/useEntityForm";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import EntityFormStructure from "@dexodus/entity-form/src/EntityFormStructure";

interface CreateTelegramAccountFormProps {
    structure: EntityFormStructure | string;
    setShowQRCode: React.Dispatch<React.SetStateAction<() => void>>;
    onCreatedTelegramAccount?: (telegramAccountId: number, telegramAccountName: string) => void;
    onFailure?: () => void;
}

const CreateTelegramAccountForm: React.FC<CreateTelegramAccountFormProps> = ({structure = '/entity-form/structure/dexodus.telegram-parser-bundle.entity.telegram-account', setShowQRCode = () => {}, onCreatedTelegramAccount = () => {}, onFailure = () => {}}) => {
    const [qrCodeLoading, setQrCodeLoading] = useState<boolean>(false);
    const [telegramAccountFilled, setTelegramAccountFilled] = useState<boolean>(false);
    const [telegramAccountData, setTelegramAccountData] = useState<TelegramAccount_Create>({apiId: 0, apiHash: '', name: ''});
    const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);
    const apiFetch = useApiFetch();

    useEffect(() => {
        abortControllerRef.current = new AbortController();
    }, []);

    const loadQrCode = async (): Promise<void> => {
        setQrCodeLoading(true);

        let qrCodeResponse;

        try {
            console.log('abortController', abortControllerRef.current, 'abortController.signal', abortControllerRef.current?.signal);
            qrCodeResponse = await toast.promise(responseIsNotOkSendError(apiFetch(`/telegram/accounts/qr-code/${telegramAccountData.name}/${telegramAccountData.apiId}/${telegramAccountData.apiHash}/get`, {signal: abortControllerRef.current.signal})), {
                pending: 'Генерация QR-кода',
                success: 'QR-код сгенерирован',
                error: 'Не удалось сгенерировать QR-код',
            })
        } catch (error) {
            hide();
            onFailure();
            return;
        }

        const qrCodeResult = await qrCodeResponse.json();
        setQrCodeSvg(qrCodeResult.qrCodeSvg);
        setQrCodeLoading(false);

        const isScannedResponse = await toast.promise(responseIsNotOkSendError(apiFetch(`/telegram/accounts/qr-code/${telegramAccountData.name}/${telegramAccountData.apiId}/${telegramAccountData.apiHash}/is-scanned`, {signal: abortControllerRef.current?.signal})), {
            pending: 'Просканируйте QR-код для авторизации',
            success: 'Авторизация в телеграмм аккаунт удалась',
            error: 'Срок действия QR кода истёк или вход был отменён',
        });
        if (await isScannedResponse.json()) {
            const promiseCreateTelegramAccountResponse = apiFetch('/api/telegram_accounts', {
                signal: abortControllerRef.current?.signal,
                method: 'POST',
                body: JSON.stringify(telegramAccountData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            let id;

            try {
                const createTelegramAccountResponse = await toast.promise(responseIsNotOkSendError(promiseCreateTelegramAccountResponse), {
                    pending: 'Добавление нового телеграмм аккаунта',
                    success: 'Телеграмм аккаунт был успешно добавлен',
                    error: 'Не удалось добавить телеграмм аккаунт',
                });
                const createTelegramAccountJson = await createTelegramAccountResponse.json();
                id = parseInt(createTelegramAccountJson['@id'].split('/').pop());
                onCreatedTelegramAccount(id, telegramAccountData.name);
            } catch (error) {
                hide();
                onFailure();
                setTelegramAccountFilled(false);
            }
        } else {
            onFailure();
            setTelegramAccountFilled(false);
        }
        hide();
    }

    const {modal, show, hide} = useModal((
        <div className={styles.modal}>
            {qrCodeLoading ? <TailSpin/> : (
                <HtmlView html={qrCodeSvg}/>
            )}
        </div>
    ), (
        <h2>{qrCodeLoading ? 'QR-код генерируется' : 'Отсканируйте QR-код'}</h2>
    ), ({closeButton}) => closeButton, ModalSize.Standard, () => {
        setTelegramAccountFilled(false);
        if (abortControllerRef.current instanceof AbortController) {
            abortControllerRef.current.abort();
            setTimeout(() => abortControllerRef.current = new AbortController());
        }
    });

    const {entityForm, validate} = useEntityForm({
        structure: structure,
        renderControls: () => <></>,
        onChange: (data) => {
            setTelegramAccountData(data);
            setTelegramAccountFilled(false)
        },
    })

    const showQRCode = () => {
        setTelegramAccountFilled(false);
        validate(() => {
            setTelegramAccountFilled(true);
            show();
            loadQrCode().then();
        }, () => {
            onFailure();
        });
    }

    useEffect(() => {
        setShowQRCode(() => showQRCode);
    }, [validate, telegramAccountData]);

    return (
        <div className={styles.createTelegramAccountForm}>
            {entityForm}
            {modal}
        </div>
    );
};

export default CreateTelegramAccountForm;
