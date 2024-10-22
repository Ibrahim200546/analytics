import React from "react";

export interface PageProps {
    options: {[optionName: string]: any};
    searchParams: { [key: string]: string | string[] | undefined };
}

type Page<T extends PageProps> = React.FC<T>;

export default Page;
