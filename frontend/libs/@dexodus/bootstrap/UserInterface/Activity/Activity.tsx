"use client";

import React from "react";
import styles from "./Activity.module.scss";
import moment from "moment";
import "moment/locale/ru";

export interface ActivityItem {
    color: string;
    title: React.ReactNode;
    time: Date;
}

interface ActivityProps {
    items: ActivityItem[];
}

const Activity: React.FC<ActivityProps> = ({items}) => {
    moment.locale('ru-RU');

    const sortedItems = items.sort((a, b) => {
        return a.time > b.time ? -1 : 1;
    })

    return (
        <div className={styles.activity}>
            {sortedItems.map(item => (
                <div className={styles.activity__item} style={{borderColor: item.color}}>
                    <div className={styles.activity__item__circle} style={{backgroundColor: item.color}}></div>
                    <span className={styles.activity__item__title}>{item.title}</span>
                    <span className={styles.activity__item__agoTime}>{moment(item.time).fromNow()}</span>
                </div>
            ))}
        </div>
    );
};

export default Activity;
