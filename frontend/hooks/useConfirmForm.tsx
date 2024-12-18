import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import styles from "@/components/SupervisorCard/SupervisorCard.module.scss";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import React, {useState} from "react";

export interface ConfirmFormOptions {
    modalHeader?: React.ReactNode;
    modalContent?: React.ReactNode;
    confirmButtonContent?: React.ReactNode;
    actionAfterConfirm: (() => void) | (() => Promise<void>);
}

export interface UseConfirmFormReturn {
    form: React.ReactNode;
    show: () => void;
    hide: () => void;
    loading: boolean;
}

const useConfirmForm = (options: ConfirmFormOptions): UseConfirmFormReturn => {
    const [loading, setLoading] = useState<boolean>(false);

    const {modal, show, hide} = useModal((
        <div>
            {options.modalContent ?? ''}
        </div>
    ), (
        <h2>
            {options.modalHeader ?? 'Вы уверены что хотите совершить данное действие?'}
        </h2>
    ), ({close}) => (
        <div className={styles.controls}>
            <Button
                onClick={() => {
                    (async () => {
                        setLoading(true);
                        hide();
                        const result = options.actionAfterConfirm();

                        if (result instanceof Promise) {
                            await result;
                        }

                        setLoading(false);
                    })().then();
                }}
                style={ButtonStyle.Danger}
                isLoading={loading}
                className={styles.control}
            >
                {options.confirmButtonContent ?? 'Подтвердить'}
            </Button>
            <Button className={styles.control} onClick={close} isLoading={loading}>Закрыть</Button>
        </div>
    ), ModalSize.Large)

    return {
        form: modal,
        show,
        hide,
        loading,
    };
}

export default useConfirmForm;
