"use client";

import React from "react";
import styles from "./SignButton.module.scss";
import Button from "@dexodus/bootstrap/src/UserInterface/Button";
import {ButtonProps} from "@dexodus/bootstrap/src/UserInterface/Button/Button";
// @ts-ignore
import {NCALayerClient} from "ncalayer-js-client/ncalayer-client";

const encodeUtf8ToBase64 = (value: string): string => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
};

export interface SignButtonProps extends ButtonProps {
    signContent: string;
    onSign?: (signedContent: string) => void;
}

const SignButton: React.FC<SignButtonProps> = ({children, onSign, signContent, onClick, ...props}) => {
    return (
        <Button className={styles.signButton} onClick={async (event) => {
            const ncalayerClient = new NCALayerClient();
            try {
                await ncalayerClient.connect();
            } catch (error) {
                alert(`Не удалось подключиться к NCALayer: "${(error as Error).message}"`);
                return;
            }

            let activeTokens;
            try {
                activeTokens = await ncalayerClient.getActiveTokens();
            } catch (error) {
                alert((error as Error).toString());
                return;
            }

            const storageType = activeTokens[0] || NCALayerClient.fileStorageType;

            let base64EncodedSignature;
            try {
                base64EncodedSignature = await ncalayerClient.createCAdESFromBase64(storageType, encodeUtf8ToBase64(signContent));
            } catch (error) {
                return;
            }

            if (onSign) {
                onSign(base64EncodedSignature);
            }

            if (onClick) {
                onClick(event);
            }
        }} {...props}>
            {children}
        </Button>
    );
};

export default SignButton;
