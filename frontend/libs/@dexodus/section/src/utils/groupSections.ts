import {Section, SectionsGroup} from "@/libs/@dexodus/section/src/types";

const groupSections = (sections: Section[]): SectionsGroup[] => {
    const sectionsGroups: {[groupKey: string]: Section[]} = {};

    for (const sectionKey in sections) {
        const section = sections[sectionKey];
        const groupKey = section?.groupKey ?? sectionKey;

        if (!(groupKey in sectionsGroups)) {
            sectionsGroups[groupKey] = [];
        }

        sectionsGroups[groupKey].push(section);
    }

    return Object.values(sectionsGroups);
}

export default groupSections;
