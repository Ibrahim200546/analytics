"use client";

import React from "react";
import styles from "./Reaction.module.scss";
import {BiHappy} from "react-icons/bi";
import {BsEmojiAngry, BsEmojiNeutral} from "react-icons/bs";
import {AiOutlineQuestionCircle} from "react-icons/ai";

export enum ReactionTypeEnum {
    POSITIVE,
    NEUTRAL,
    NEGATIVE,
    UNKNOWN,
}

interface ReactionProps {
    type: ReactionTypeEnum;
    size: number;
}

const Reaction: React.FC<ReactionProps> = ({type, size}) => {
    return (
        <div className={styles.reaction} style={{width: `${size}px`, height: `${size}px`}}>
            {type === ReactionTypeEnum.POSITIVE && <BiHappy color='#00FF09'/>}
            {type === ReactionTypeEnum.NEUTRAL && <BsEmojiNeutral color='#EEFF00'/>}
            {type === ReactionTypeEnum.NEGATIVE && <BsEmojiAngry color='#FF0000'/>}
            {type === ReactionTypeEnum.UNKNOWN && <AiOutlineQuestionCircle color='#00FFEA'/>}
        </div>
    );
};

export default Reaction;
