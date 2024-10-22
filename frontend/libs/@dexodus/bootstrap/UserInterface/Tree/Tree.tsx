"use client";

import React, {useEffect, useState} from "react";
import styles from "./Tree.module.scss";
import {Collapse} from "reactstrap";
import PlusMinus from "@/libs/@dexodus/bootstrap/UserInterface/AnimatedIcons/PlusMinus";

export interface TreeItem {
    element: React.ReactNode;
    children?: TreeItem[];
}

interface TreeProps {
    treeItems: TreeItem[];
}

const buildTree = (treeItems: TreeItem[], prefix: string = '', tree: any = {}) => {
    for (const treeItemName in treeItems) {
        const treeItem = treeItems[treeItemName];

        if (treeItem.children && treeItem.children.length) {
            tree[prefix + treeItemName] = false;
            tree = {...tree, ...buildTree(treeItem.children, `${treeItemName}.`)}
        }
    }

    return tree;
}

const Tree: React.FC<TreeProps> = ({treeItems}) => {
    const [tree, setTree] = useState(buildTree(treeItems));

    useEffect(() => {
        setTree(buildTree(treeItems, '', tree));
    }, [treeItems]);

    const mapTreeItem = (treeItem: TreeItem, index: number, prefix: string = '') => {
        const level = prefix.split('.').length - 1;

        return (
            <div className={styles.tree__item}>
                <div className={styles.tree__item__element} onClick={() => setTree((tree: any) => {
                    return {...tree, [prefix + index]: !tree[prefix + index]};
                })} style={{paddingLeft: `${level * 18 + 18}px`}}>
                    {treeItem.children?.length ? (
                        <PlusMinus showPlus={tree[prefix + index]} className={styles.tree__item__element__plusMinus}/>
                    ) : <div className={styles.tree__item__element__plusMinus}/>}
                    {treeItem.element}
                </div>
                {treeItem.children?.length && (
                    <Collapse isOpen={tree[prefix + index]} className={styles.tree__item__collapse}>
                        {treeItem.children.map((value, index) => mapTreeItem(value, index, `${prefix}.`))}
                    </Collapse>
                )}
            </div>
        )
    }

    return (
        <div className={styles.tree}>
            {treeItems.map((treeItem, index) => mapTreeItem(treeItem, index))}
        </div>
    );
};

export default Tree;
