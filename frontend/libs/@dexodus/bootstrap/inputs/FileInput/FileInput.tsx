"use client";

import React from "react";
import styles from "./FileInput.module.scss";
import {Input, InputProps} from "@/libs/@dexodus/bootstrap/inputs/types";

interface FileInputProps extends InputProps {
    uploadUrl: string;
}

const FileInput: Input<FileInputProps> = ({}) => {
    return (
        <div className={styles.fileInput}>
        </div>
    );
};

export default FileInput;
