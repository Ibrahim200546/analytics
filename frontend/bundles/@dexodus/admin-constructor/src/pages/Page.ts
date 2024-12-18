import React from "react";

export interface PageProps {
    options: {[optionName: string]: any};
    searchParams: { [key: string]: string | string[] | undefined };
}

type Page<T extends PageProps> = NextJS.SFC<T>;

export default Page;
