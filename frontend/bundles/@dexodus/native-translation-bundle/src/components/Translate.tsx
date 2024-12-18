import React from "react";
import TranslateServer from "./TranslateServer";
import TranslateClient from "./TranslateClient";

interface TranslateProps {

}

export type TranslateComponent = React.FC<TranslateProps>;

const Translate: TranslateComponent = (props) => {
    if (typeof window === 'undefined') {
        return <TranslateServer {...props}/>;
    } else {
        return <TranslateClient {...props}/>;
    }
}

export default Translate;
