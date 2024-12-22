"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./SubscriptionCard.module.scss";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import Card from "@dexodus/bootstrap/src/UserInterface/Card";
import Subscription from "@/apiTypes/App/Entity/Subscription";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import Organization from "@/apiTypes/App/Entity/Organization";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import Field from "@dexodus/react-form/src/fields/Field";
import Form from "@dexodus/react-form/src/Form";
import JsValidator from "@dexodus/react-form/src/validators/JsValidator";
import DateIntervalField from "@dexodus/bootstrap/src/UserInterface/Fields/DateIntervalField";
import {DateInterval} from "@dexodus/bootstrap/src/helpers/DateIntervalHelper";
import {compareDates, countDaysInDateInterval, mapDateValueToDate} from "@dexodus/bootstrap/src/common/date";
import {pluralize} from "@dexodus/bootstrap/src/common/string";
import DropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/DropdownField";
import {Jsel} from "@dexodus/jsel";
import PriceField from "@dexodus/bootstrap/src/UserInterface/Fields/PriceField";
import {ValidateCallback} from "@dexodus/react-form/src/Form";
import notBlank from "@dexodus/react-form/src/validators/notBlank";
import apiFetch from "@dexodus/api-fetch/src/apiFetch";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useRouter} from "next/navigation";
import moment from "moment";
import {convertNumberToPrice} from "@dexodus/bootstrap/src/common/price";
import useCheckHavingRole from "@/hooks/useCheckHavingRole";

interface SubscriptionCardProps {
    subscription: Subscription | null;
    organization: Organization;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({subscription, organization}) => {
    const isAdmin = useCheckHavingRole('ROLE_ADMIN');
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const jselRef = useRef<Jsel | null>();
    const [subscriptionEntity, setSubscriptionEntity] = useState(subscription ? {
        interval: {start: new Date(subscription.start), end: new Date(subscription.end)} as DateInterval,
        type: {key: subscription.type, value: subscription.type === "demo" ? "Демо подписка" : "Основная подписка"},
        price: subscription.price ?? 0,
        priceForProjectImprovements: subscription.priceForProjectImprovements ?? 0,
    } : {
        interval: {start: new Date(), end: null} as DateInterval,
        type: null,
        price: 0,
        priceForProjectImprovements: 0,
    });
    const [validateCb, setValidateCb] = useState<ValidateCallback>(() => {
    });

    useEffect(() => {
        if (!subscription && jselRef.current && "assign" in jselRef.current && subscriptionEntity.interval.start) {
            const compareResult = compareDates(new Date(), mapDateValueToDate(subscriptionEntity.interval.start) as Date);

            if (compareResult === 1) {
                jselRef.current.assign("data.interval.start", new Date());
            }
        }
    }, [subscriptionEntity.interval]);

    useEffect(() => {
        if (jselRef.current && "assign" in jselRef.current && subscriptionEntity.priceForProjectImprovements > subscriptionEntity.price) {
            jselRef.current.assign("data.priceForProjectImprovements", subscriptionEntity.price);
        }
    }, [subscriptionEntity.priceForProjectImprovements, subscriptionEntity.price]);

    const countDays = countDaysInDateInterval(subscriptionEntity.interval);

    const {modal, show, hide} = useModal((
        <div>
            <Form
                setValidateCb={setValidateCb}
                data={subscriptionEntity}
                setData={setSubscriptionEntity}
                onJselInit={formJselRef => {
                    jselRef.current = formJselRef.current;
                }}
            >
                <Field component={DateIntervalField} property="interval" label="Интервал подписки" validators={[
                    new JsValidator((data, value) => {
                        if (value.start && value.end) {
                            return true;
                        }

                        return "Поле должно быть заполнено";
                    }),
                ]}/>
                {subscriptionEntity.interval.start && subscriptionEntity.interval.end && (
                    <p className={styles.subscriptionDuration}>
                        Подписка будет действовать {countDays} {pluralize(countDays, ["день", "дня", "дней"])}
                    </p>
                )}
                <Field
                    component={DropdownField}
                    property="type"
                    label="Тип подписки"
                    validators={[notBlank("Поле должно быть заполнено")]}
                    componentProps={{
                        options: {
                            general: "Основная подписка",
                            demo: "Демо подписка",
                        },
                    }}
                />
                <Field component={PriceField} property="price" label="Цена" componentProps={{
                    currency: "тг",
                }}/>
                <Field
                    component={PriceField}
                    property="priceForProjectImprovements"
                    label="Сколько уйдет на развитие проекта"
                    componentProps={{
                        currency: "тг",
                    }}
                />
            </Form>
        </div>
    ), (
        <h2>
            <span>{subscription ? "Корректировка" : "Оформление"}</span>
            <span> подписки для организации "</span>
            <span className={styles.date}>{organization.name}</span>
            <span>"</span>
        </h2>
    ), ({close}) => (
        <div className={styles.modalControls}>
            <Button
                onClick={() => validateCb(async () => {
                    setLoading(true);
                    hide();
                    const createSubscriptionResponse = await apiFetch(subscription ? `/api/subscriptions/${subscription.id}` : "/api/subscriptions", {
                        method: subscription ? "PUT" : "POST",
                        body: JSON.stringify({
                            organization: `/api/organizations/${organization.id}`,
                            start: mapDateValueToDate(subscriptionEntity.interval.start),
                            end: mapDateValueToDate(subscriptionEntity.interval.end),
                            type: subscriptionEntity.type.key,
                            price: subscriptionEntity.price,
                            priceForProjectImprovements: subscriptionEntity.priceForProjectImprovements,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (createSubscriptionResponse.ok) {
                        toast(`Подписка была ${subscription ? 'скорректирована' : 'оформлена'}`, {type: "success"});
                        router.refresh();
                    } else {
                        toast(`Не удалось ${subscription ? 'скорректировать' : 'оформить'} подписку`, {type: "error"});
                    }
                    setLoading(false);
                })}
                style={ButtonStyle.Success}
                isLoading={loading}
            >
                {subscription ? 'Скорректировать' : 'Оформить'}
            </Button>
            <Button onClick={close}>Закрыть</Button>
        </div>
    ), ModalSize.Large);

    const {modal: deleteModal, show: showDeleteModal, hide: hideDeleteModal} = useModal((
        <div>
            Вы уверены что хотите удалить подписку без возможности восстановления?
        </div>
    ), (
        <h2>
            <span>Удаление подписки для организации "</span>
            <span className={styles.date}>{organization.name}</span>
            <span>"</span>
        </h2>
    ), ({close}) => (
        <div className={styles.modalControls}>
            <Button
                onClick={() => {
                    (async () => {
                        setLoading(true);
                        hideDeleteModal();
                        const deleteSubscriptionResponse = await apiFetch(`/api/subscriptions/${subscription?.id}`, {
                            method: "DELETE",
                        });
                        if (deleteSubscriptionResponse.ok) {
                            toast(`Подписка была удалена`, {type: "success"});
                            router.refresh();
                        } else {
                            toast(`Не удалось удалить подписку`, {type: "error"});
                        }
                        setLoading(false);
                    })().then();
                }}
                style={ButtonStyle.Danger}
                isLoading={loading}
            >
                Удалить подписку
            </Button>
            <Button onClick={close}>Закрыть</Button>
        </div>
    ), ModalSize.Large)

    return (
        <Card title={"Подписка"} className={styles.subscriptionCard}>
            {subscription ? (
                <div>
                    <ul>
                        <li>
                            <b>{subscription.type === "demo" ? "Демо " : "Основная "}</b>
                            <b>{subscription.active ? "подписка действует:" : "подписка начнет действовать:"}</b>
                            <span className={styles.subscriptionAbsent}> с </span>
                            <span className={styles.date}>{moment(subscription.start).format("DD MMM YYYY")}</span>
                            <span className={styles.subscriptionAbsent}> по </span>
                            <span className={styles.date}>{moment(subscription.end).format("DD MMM YYYY")}</span>
                        </li>
                        <li><b>Общая длительность подписки: </b><i>{countDaysInDateInterval({
                            start: new Date(subscription.start),
                            end: new Date(subscription.end),
                        })} {pluralize(countDaysInDateInterval({
                            start: new Date(subscription.start),
                            end: new Date(subscription.end),
                        }), ["день", "дня", "дней"])}</i></li>
                        {isAdmin && (
                            <>
                                {subscription.price &&
                                    <li><b>Цена подписки: </b><i>{convertNumberToPrice(subscription.price, "тг")}</i></li>}
                                {subscription.priceForProjectImprovements && <li><b>Сколько уйдет на развитие
                                    проекта: </b><i>{convertNumberToPrice(subscription.priceForProjectImprovements, "тг")}</i>
                                </li>}
                            </>
                        )}
                    </ul>
                    {isAdmin && (
                        <div className={styles.controls}>
                            <Button isLoading={loading} onClick={() => show()} style={ButtonStyle.Success} className={styles.control}>Изменить
                                подписку</Button>
                            <Button isLoading={loading} onClick={() => showDeleteModal()} style={ButtonStyle.Danger} className={styles.control}>Удалить подписку</Button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p className={styles.subscriptionAbsent}>Подписка отсутствует</p>
                    {isAdmin && (
                        <div className={styles.controls}>
                            <Button
                                style={ButtonStyle.Success}
                                onClick={() => show()}
                                isLoading={loading}
                            >
                                Оформить подписку
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {isAdmin && (
                <>
                    {modal}
                    {deleteModal}
                </>
            )}
        </Card>
    );
};

export default SubscriptionCard;
