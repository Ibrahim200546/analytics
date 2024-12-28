import React from "react";
import HelpInformation from "@dexodus/react-form/src/fields/HelpInformation";

const renderLabel = (label: React.ReactNode): React.ReactNode => {
    if (typeof label === 'string') {
        const parts = label.split(/(<\?.+?\?>)/).map((part, index) => {
            const match = part.match(/<\?(.+?)\?>/);
            if (match) {
                return (
                    <HelpInformation key={index}>
                        {match[1]}
                    </HelpInformation>
                );
            }

            return part;
        });

        return <>{parts}</>
    }

    return label;
}

export default renderLabel;
