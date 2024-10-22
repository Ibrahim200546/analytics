import React from "react";
import styles from "./page.module.scss";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";
import moment from "moment";
import "moment/locale/ru";
import {BsArrowRight} from "react-icons/bs";
import LinkButton from "@/libs/@dexodus/bootstrap/UserInterface/LinkButton";
import {ButtonStyle} from "@/libs/@dexodus/bootstrap/UserInterface/Button";

interface TrackedCurrency {
    id: number;
    currencyCode: string;
    latestUpdate: string;
}

interface CurrencyPair {
    id: number;
    sellCurrency: TrackedCurrency;
    buyCurrency: TrackedCurrency;
    price: number;
}

interface PageProps {
    params: {
        id: string;
    };
}

const Page: React.FC<PageProps> = async ({params}) => {
    const trackedCurrencyId = params.id;
    const apiFetch = await getApiFetch();

    const results = await Promise.all([
        apiFetch(`/api/tracked_currencies/${trackedCurrencyId}`),
        apiFetch(`/api/currencies/buy-pairs/${trackedCurrencyId}`),
        apiFetch(`/api/currencies/sell-pairs/${trackedCurrencyId}`),
    ]).then(results => Promise.all(results.map(result => result.json())))

    const trackedCurrency = results[0] as TrackedCurrency;
    const buyPairs = results[1] as CurrencyPair[];
    const sellPairs = results[2] as CurrencyPair[];

    return (
        <div className={styles.page}>
            <div className={styles.back}>
                <LinkButton href='/admin/trackedCurrencies/list' style={ButtonStyle.Primary}>Назад</LinkButton>
            </div>
            <Card title={`Валюта ${trackedCurrency.currencyCode}`} anyWidth={true}>
                <b>Последнее обновление валютных пар: </b>
                <i>{moment(trackedCurrency.latestUpdate).fromNow()}</i>
            </Card>
            <div className={styles.exchanges}>
                <Card title="Курсы продажи">
                    <ul>
                        {sellPairs.map(currencyPair => (
                            <li key={currencyPair.id} className={styles.pair}>
                                <i>{currencyPair.sellCurrency.currencyCode} <BsArrowRight/> {currencyPair.buyCurrency.currencyCode}: {currencyPair.price}</i>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Курсы покупки">
                    <ul>
                        {buyPairs.map(currencyPair => (
                            <li key={currencyPair.id} className={styles.pair}>
                                <i>{currencyPair.sellCurrency.currencyCode} <BsArrowRight/> {currencyPair.buyCurrency.currencyCode}: {currencyPair.price}</i>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Page;
