import {Storage} from '../IconStorage/IconStorage';
import {TbMessages} from "react-icons/tb";
import {PiFileTextLight, PiUsersThree} from "react-icons/pi";
import React from "react";
import {HiOutlineBuildingOffice} from "react-icons/hi2";
import {LiaInfoCircleSolid} from "react-icons/lia";
import styles from './storage.module.scss';
import {GrAnalytics} from "react-icons/gr";

export const storage: Storage = {
    'eco_notifications': <div className={styles.iconWrapper}><TbMessages/></div>,
    'eco_users': <div className={styles.iconWrapper}><PiUsersThree/></div>,
    'eco_organizations': <div className={styles.iconWrapper}><HiOutlineBuildingOffice/></div>,
    'eco_applications': <div className={styles.iconWrapper}><PiFileTextLight/></div>,
    'eco_dictionaries': <div className={styles.iconWrapper}><LiaInfoCircleSolid/></div>,
    'eco_analytics': <div className={styles.iconWrapper}><GrAnalytics/></div>,
};
