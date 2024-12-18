import React from "react";
import styles from "./Breadcrumb.module.scss";
import classnames from "classnames";
import Link from "next/link";

export interface BreadcrumbItem {
    label: React.ReactNode;
    link?: string | undefined;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string | undefined;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({items, className}) => {
    return (
        <div className={classnames(styles.breadcrumb, className)}>
            {items.map((item, index) => {
                if (item.link) {
                    return (
                        <span>
                            <Link href={item.link ?? "#"}>
                                {item.label}
                            </Link>

                            {items.length > index + 1 ? <div className={styles.splitter}/> : ""}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            <span>{item.label}</span>{items.length > index + 1 ? <div className={styles.splitter}/> : ""}
                        </span>
                    );
                }
            })}
        </div>
    );
};

export default Breadcrumb;
