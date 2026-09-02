"use client";

import React, {useEffect, useState} from "react";
import styles from "./ArticleComment.module.scss";
import ArticleComment_View from "@/apiTypes/Dexodus/SmiParserBundle/Entity/ArticleComment_View";
import moment from "moment";
import "moment/locale/ru";
import Reaction from "@/components/Reaction";
import {ReactionTypeEnum} from "@/components/Reaction/Reaction";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import StringField from "@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import AsyncDropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/AsyncDropdownField";
import notBlank from "@dexodus/react-form/src/validators/notBlank";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import responseIsNotOkSendError from "@dexodus/api-fetch/src/responseIsNotOkSendError";
import {toast} from "react-toastify";
import OrganizationAccount from "@/apiTypes/App/Entity/OrganizationAccount";

interface ArticleCommentProps {
    articleComment: ArticleComment_View
    organizationId?: string;
    reloadProjectArticle?: () => void;
}

const ArticleComment: React.FC<ArticleCommentProps> = ({articleComment, organizationId, reloadProjectArticle = () => {}}) => {
    const [messageSending, setMessageSending] = useState<boolean>(false);
    const [myOrganizationComment, setMyOrganizationComment] = useState<boolean>(false);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const apiFetch = useApiFetch();

    useEffect(() => {
        (async () => {
            if (articleComment.userId && articleComment.userId.startsWith('ISMI_ACCOUNT:')) {
                const ismiAccountId = parseInt(articleComment.userId.split(':').pop() as string);
                let item = window.localStorage.getItem(`ismiAccount-${ismiAccountId}`);

                if (item === null) {
                    const organizationAccountResponse = await apiFetch(`/api/organization_accounts/${ismiAccountId}`);
                    const organizationAccount: OrganizationAccount = await organizationAccountResponse.json();
                    item = `${organizationAccount.organization?.id}`;
                    window.localStorage.setItem(`ismiAccount-${ismiAccountId}`, item);
                }

                setMyOrganizationComment(item === organizationId);
            }
        })();
    }, []);

    const sendMessage = async () => {
        setMessageSending(true);
        const replyFetch = apiFetch(`/smi/reply/comment/${articleComment.id}`, {
            method: 'POST',
            body: JSON.stringify({
                comment: data.content,
                accountId: parseInt(data.account.split('/').pop() as string),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const replyResponse = await toast.promise(responseIsNotOkSendError(replyFetch), {
            pending: 'Ваш комментарий отправляется...',
            success: 'Ваш комментарий успешно отправился',
            error: 'Не удалось отправить ваш комментарий',
        });

        if (replyResponse.ok) {
            setShowReplyForm(false);
            reloadProjectArticle();
        }
        setMessageSending(false);
    }

    const {component: replyForm, data} = useForm<{content: string, account: string}>((_, validate) => (
        <>
            <Field component={StringField} property="content" label="Сообщение" validators={[notBlank('Поле должно быть заполнено')]}/>
            <Field component={AsyncDropdownField} property="account" label="Аккаунт"  validators={[notBlank('Поле должно быть заполнено')]} componentProps={{
                additionalQueryParameters: {organization: organizationId, type: 'Telegram'},
                url: '/api/organization_accounts',
                label: 'accountName',
            }}/>
            <div className={styles.replyFormControls}>
                <Button isLoading={messageSending} rounded={true} bordered={true} style={ButtonStyle.Danger} onClick={() => setShowReplyForm(false)}>Отменить</Button>
                <Button isLoading={messageSending} rounded={true} bordered={true} style={ButtonStyle.Success} onClick={() => validate(async () => await sendMessage())}>Отправить сообщение</Button>
            </div>
        </>
    ), {content: '', account: ''});

    return (
        <div className={styles.articleComment}>
            <div className={styles.header}>
                <div className={styles.commentatorAvatar}>
                    {articleComment.commentatorName.split('')[0].toUpperCase()}
                </div>
                <div className={styles.reaction}>
                    <Reaction
                        type={ReactionTypeEnum[articleComment.tone.toUpperCase() as keyof typeof ReactionTypeEnum] as ReactionTypeEnum}
                        size={22}
                    />
                </div>
                <span className={styles.commentatorName}>
                    {articleComment.commentatorName}
                    {myOrganizationComment && <span className={styles.yourOrganization}>(Ваша организация)</span>}
                </span>
                <span className={styles.createdAt}>{moment(articleComment.createdAt).fromNow()}</span>
            </div>
            <div className={styles.content}>
                <div className={styles.text}>
                    {articleComment.content}
                </div>
                {articleComment.canReply && (
                    <div>
                        {!showReplyForm && <span className={styles.reply} onClick={() => setShowReplyForm(true)}>Ответить</span>}
                        {showReplyForm && replyForm}
                    </div>
                )}
                {(articleComment.replies as ArticleComment_View[]).map(comment => (
                    <ArticleComment key={comment.id} articleComment={comment} organizationId={organizationId} reloadProjectArticle={reloadProjectArticle}/>
                ))}
            </div>
        </div>
    );
};

export default ArticleComment;
