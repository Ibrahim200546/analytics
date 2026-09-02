"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./TagsField.module.scss";
import {FieldComponent, FieldComponentProps} from "@dexodus/react-form";
import BasicInput from "@dexodus/bootstrap/src/inputs/BasicInput";
import {IoClose} from "react-icons/io5";

interface TagsFieldProps extends FieldComponentProps {
}

const TagsField: FieldComponent<TagsFieldProps> = ({value, onChange}) => {
    const [tag, setTag] = useState<string>('')
    const inputRef = useRef<HTMLInputElement | null>(null);

    const deleteTag = (tag: string) => {
        onChange(value.filter((valueTag: string) => valueTag !== tag));
    }

    const addTagAndClearInput = () => {
        onChange([...value, tag.trim()].sort((a: string, b: string) => a.length < b.length ? 1 : -1));
        setTag('');
    }

    useEffect(() => {
        const onKeyPress = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' || tag.replaceAll(' ', '').length < 3) {
                return;
            }

            addTagAndClearInput();
        }

        if (inputRef.current) {
            const inputElement = inputRef.current as HTMLInputElement;

            inputElement.addEventListener('keypress', onKeyPress);
        }

        return () => {
            if (inputRef.current) {
                const inputElement = inputRef.current as HTMLInputElement;

                inputElement.removeEventListener('keypress', onKeyPress);
            }
        }
    }, [inputRef.current, addTagAndClearInput]);

    return (
        <div className={styles.tagsField}>
            <BasicInput inputRef={inputRef} type="string" value={tag} setValue={(value: string) => setTag(value.toLowerCase())}/>
            <div className={styles.underField}>
                <p className={styles.tagsTitle}>Добавленные тэги:</p>
                <div className={styles.tags}>
                    {value.map((tag: string) => (
                        <span className={styles.tag}>
                            <span>{tag}</span>
                            <span onClick={() => deleteTag(tag)} className={styles.deleteTag}>
                                <IoClose/>
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagsField;
