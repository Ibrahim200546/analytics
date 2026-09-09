"use client";

import React, {CSSProperties} from "react";
import styles from "./SectionArranger.module.scss";
import {Section, SectionsGroup} from "@dexodus/section/src/types";
import classnames from "classnames";
import groupSections from "@dexodus/section/src/utils/groupSections";

interface SectionArrangerProps {
    sections: Section[];
    className?: string;
    style?: CSSProperties;
}

const SectionArranger: React.FC<SectionArrangerProps> = (
    {
        sections,
        className,
        style,
    },
) => {
    const sectionsGroups = groupSections(sections);

    const renderSection = (section: Section, key: string): React.ReactNode => {
        const style: CSSProperties = section?.basis ? { flexBasis: `${section.basis * 100}%` } : {};

        return (
            <div key={key} className={styles.section} style={style}>
                {section && section.component}
            </div>
        );
    }

    const renderSectionGroup = (sectionGroup: SectionsGroup, groupKey: number): React.ReactNode => {
        const sections: Section[] = Array.isArray(sectionGroup) ? sectionGroup : [sectionGroup];

        return (
            <div key={groupKey} className={styles.sectionGroup}>
                {sections.map((section, sectionKey) => renderSection(section, `${groupKey}-${sectionKey}`))}
            </div>
        );
    }

    return (
        <div className={classnames(styles.sectionArranger, className)} style={style}>
            {sectionsGroups.map((sectionGroup, groupKey) => renderSectionGroup(sectionGroup, groupKey))}
        </div>
    );
};

export default SectionArranger;
