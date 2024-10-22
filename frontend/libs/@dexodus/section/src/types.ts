import React from "react";

export type Section = null | {
    groupKey?: string;
    component?: React.ReactNode;
    basis?: number;
}

export type SectionsGroup = Section[] | Section;
