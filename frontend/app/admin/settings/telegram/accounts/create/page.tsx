"use client";

import React, {useState} from "react";
import styles from "./page.module.scss";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import {useRouter} from "next/navigation";
import CreateTelegramAccountForm from "@/components/CreateTelegramAccountForm";

type PageProps = Record<string, never>;

const Page: React.FC<PageProps> = ({}) => {
    const [showQRCode, setShowQRCode] = useState<() => void>(() => {});
    const router = useRouter();

    return (
        <div className={styles.page}>
            <Card title="Добавить новый телеграмм аккаунт">
                <CreateTelegramAccountForm setShowQRCode={setShowQRCode} onCreatedTelegramAccount={() => {
                    router.push('/admin/settings/telegram/accounts/list');
                }}/>
                <Button style={ButtonStyle.Success} onClick={showQRCode}>
                    Добавить
                </Button>
            </Card>
        </div>
    );
};

export default Page;
