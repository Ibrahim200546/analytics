'use client'

import React, {useEffect, useRef, useState} from "react";
import styles from "./Notification.module.scss"
import {IoNotificationsOutline} from "react-icons/io5";
import Popup from "../Popup";
import {SystemNotification} from "@/libs/@dexodus/admin-constructor/src/TopBar";
import useOnClickInDocument from "@/libs/@dexodus/bootstrap/hooks/useOnClickInDocument";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";

interface NotificationProps {
    notifications?: SystemNotification[];
    countNewNotifications?: number;
}

const Notification: React.FC<NotificationProps> = ({notifications = [], countNewNotifications = 0}) => {
    const [listHidden, setListHidden] = useState<boolean>(true)
    const [viewed, setViewed] = useState<boolean>(false);
    const [countViewed, setCountViewed] = useState<number>(0);
    const divRef = useRef<HTMLDivElement>(null);
    useOnClickInDocument([divRef], () => setListHidden(true));
    const apiFetch = useApiFetch();

    const click = () => {
        setListHidden(listHidden => !listHidden);
    }

    useEffect(() => {
        if (!listHidden && !viewed) {
            setViewed(true);

            for (const notification of notifications) {
                apiFetch(`/notifications/check/${notification.id}`).then();
                setCountViewed(countViewed => countViewed + 1)
            }
        }
    }, [listHidden]);

    return (
        <div className={styles.notification} onClick={click} ref={divRef}>
            <Popup hidden={listHidden} className={styles.popup}>
                {notifications.map(notification => (
                    <div key={notification.id} className={styles.notificationItem}>
                        <h5>{notification.titlePlainText}</h5>
                        <p>{notification.contentHtml}</p>
                        {notification.link && (
                            <a href={notification.link}>Подробнее</a>
                        )}
                    </div>
                ))}
            </Popup>
            <div className={styles.icon}>
                <IoNotificationsOutline/>
            </div>
            {countNewNotifications - countViewed > 0 && (
                <span className={styles.countNewNotifications}>{countNewNotifications - countViewed}</span>
            )}
        </div>
    )
}

export default Notification;
