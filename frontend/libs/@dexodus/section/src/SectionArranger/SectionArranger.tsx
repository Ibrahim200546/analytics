"use client";

import React, {CSSProperties} from "react";
import styles from "./SectionArranger.module.scss";
import {Section, SectionsGroup} from "@/libs/@dexodus/section/src/types";
import classnames from "classnames";
import groupSections from "@/libs/@dexodus/section/src/utils/groupSections";

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

    const renderSection = (section: Section): React.ReactNode => {
        const basis = section?.basis ?? 1;

        return (
            <div className={styles.section} style={{flexBasis: `${basis * 100}vw`}}>
                {section && section.component}
            </div>
        );
    }

    const renderSectionGroup = (sectionGroup: SectionsGroup): React.ReactNode => {
        const sections: Section[] = Array.isArray(sectionGroup) ? sectionGroup : [sectionGroup];

        return (
            <div className={styles.sectionGroup}>
                {sections.map(section => renderSection(section))}
            </div>
        );
    }

    return (
        <div className={classnames(styles.sectionArranger, className)} style={style}>
            {sectionsGroups.map(sectionGroup => renderSectionGroup(sectionGroup))}
        </div>
    );
};

export default SectionArranger;
