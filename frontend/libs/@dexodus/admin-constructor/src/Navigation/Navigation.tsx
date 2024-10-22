"use client";

import React, {useEffect, useState} from "react";
import {Collapse} from "reactstrap";
import styles from "./Navigation.module.scss";
import Link from "next/link";
import {VscChevronUp} from "react-icons/vsc";
import classNames from "classnames";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import IconStorage from "@/libs/@dexodus/icon-storage/src/IconStorage";
import {storage} from "@/libs/@dexodus/icon-storage/src/eco/storage";
import useAdminConstructorDispatch from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorDispatch";
import useAdminConstructorSelector from "@/libs/@dexodus/admin-constructor/src/hooks/redux/useAdminConstructorSelector";
import {AdminConstructorSlice} from "@/libs/@dexodus/admin-constructor/src/redux/adminConstructorReducer";
import classnames from "classnames";

interface Page {
    type: string;

    [property: string]: any;
}

interface WithIcons {
    _icons: {
        [path: string]: string;
    },
}

interface NavigationItem {
    [path: string]: NavigationItem | Page | string | null;
}

interface NavigationProps {
    rootItem: NavigationItem & WithIcons;
    context?: string;
    autoOpenPath?: string;
    icon?: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({rootItem, context = "", icon}) => {
    const dispatch = useAdminConstructorDispatch();
    const navigationPath = useAdminConstructorSelector(state => state.navigationPath);
    const currentPage = useAdminConstructorSelector(state => state.currentPage);

    const paddingLeft = `${(context.split('.').length) * 32 - 12}px`;
    const paddingLeftLink = `${(context.split('.').length) * 32 + (!context ? 0 : 32) - 12}px`;

    const subItems = Object.entries(rootItem).map(([path, item]) => {
        if (typeof item === 'string' || (typeof item === 'object' && item === null) || path === '_icons') {
            return undefined;
        }

        const pathToItem = context ? `${context}.${path}` : path;
        const iconKey = rootItem['_icons'][path];

        if ("type" in item) {
            const link = `/admin/${pathToItem.replaceAll('.', '/')}`;

            return (
                <Link key={pathToItem} href={link} className={classNames(styles.button, styles.link)} style={{paddingLeft: paddingLeftLink}}>
                    <div className={classnames(styles.text, currentPage === pathToItem && styles.active)}>
                        <IconStorage name={iconKey} storage={storage}/>
                        <TextTranslation label={`navigation.${pathToItem}`}/>
                    </div>
                </Link>
            );
        }

        return <Navigation key={pathToItem} rootItem={item as NavigationItem & WithIcons} context={pathToItem} icon={<IconStorage name={iconKey} storage={storage}/>}/>;
    });


    const opened = navigationPath.startsWith(context);

    const open = (path: string) => {
        if (opened) {
            dispatch(AdminConstructorSlice.actions.AdminConstructorChangeNavigation(path.split('.').slice(0, -1).join('.')));
        } else {
            dispatch(AdminConstructorSlice.actions.AdminConstructorChangeNavigation(path));
        }
    }

    return (
        <div className={styles.navigation}>
            {context && (
                <>
                    <div className={styles.buttonContainer} onClick={() => open(context)}>
                        <button className={styles.button} style={{paddingLeft}}>
                            <div className={styles.text}>
                                {icon}
                                <TextTranslation label={`navigation.${context}`}/>
                            </div>
                        </button>
                        <VscChevronUp className={classNames(styles.downIcon, opened && styles.show)}/>
                    </div>
                    <Collapse isOpen={opened} className={styles.collapse}>
                        {subItems}
                    </Collapse>
                </>
            )}
            {!context && subItems}
        </div>
    );
};

export default Navigation;
