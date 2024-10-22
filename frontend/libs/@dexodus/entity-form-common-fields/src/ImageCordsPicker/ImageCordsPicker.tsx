"use client";

import React, {useContext, useEffect, useRef, useState} from "react";
import styles from "./ImageCordsPicker.module.scss";
import {FieldComponentProps} from "@/libs/@dexodus/react-form";
import FieldComponent from "../../../react-form/src/fields/FieldComponent";
import {FormContext, FormContextValue} from "@/libs/@dexodus/react-form/src/Form";
import {EventType} from "@dexodus/jsel/src/Event/Event";
import {File} from "@/types/file";
import ReactCrop, {Crop} from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";

interface ImageCordsPickerProps extends FieldComponentProps {
    lookAtFile: string;
    backendUrl: string;
}

const ImageCordsPicker: FieldComponent<ImageCordsPickerProps> = ({lookAtFile, backendUrl, value, onChange}) => {
    const {jselRef} = useContext(FormContext) as FormContextValue;
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const imageRef = useRef<HTMLImageElement>(null);
    const apiFetch = useApiFetch();

    useEffect(() => {
        const changeUpdateCount = (event: any) => {
            if (event.path !== `data.${lookAtFile}`) {
                return;
            }

            setFileUrl(event.value);
        };

        jselRef.current.addEventListener(EventType.ASSIGN, changeUpdateCount);

        const data = jselRef.current.exec(`data.${lookAtFile}`);

        if (data && 'temporaryUrl' in data) {
            setFileData(data);
        }

        return () => {
            jselRef.current.removeEventListener(EventType.ASSIGN, changeUpdateCount);
        };
    }, []);

    useEffect(() => {
        if (!fileUrl) {
            return;
        }

        (async () => {
            const result = await apiFetch(`${backendUrl}${fileUrl}`);
            const json = await result.json() as File;
            setFileData(json);
        })();
    }, [fileUrl]);

    useEffect(() => {
        console.log('imageRef.current', imageRef.current);
        if (imageRef.current && value && !crop) {
            imageRef.current.onload = () => {
                if (!imageRef.current || crop) {
                    return;
                }

                const aspectX = imageRef.current.clientWidth / imageRef.current.naturalWidth;
                const aspectY = imageRef.current.clientHeight / imageRef.current.naturalHeight;

                setCrop({
                    x: Math.floor(value.x * aspectX),
                    y: Math.floor(value.y * aspectY),
                    width: Math.floor(value.width * aspectX),
                    height: Math.floor(value.height * aspectY),
                    unit: "px",
                });
            }

        }
    }, [fileData, imageRef.current === undefined]);

    return (
        <div className={styles.imageCordsPicker}>
            {!fileData && (
                <ul>
                    <li><i>Для выбора координат, сначала загрузите изображение</i></li>
                </ul>
            )}
            {fileData && (
                <ReactCrop crop={crop} onChange={(crop, percentageCrop) => {
                    if (!imageRef.current) {
                        return;
                    }

                    if (!value) {
                        value = {};
                    }

                    const newValue = {
                        ...value,
                        x: Math.floor(percentageCrop.x * imageRef.current.naturalWidth / 100),
                        y: Math.floor(percentageCrop.y * imageRef.current.naturalHeight / 100),
                        width: Math.floor(percentageCrop.width * imageRef.current.naturalWidth / 100),
                        height: Math.floor(percentageCrop.height * imageRef.current.naturalHeight / 100),
                    }

                    onChange(newValue);
                    setCrop(crop);
                }}>
                    <img ref={imageRef} src={fileData.temporaryUrl} alt={fileData.temporaryUrl}/>
                </ReactCrop>
            )}
        </div>
    );
};

export default ImageCordsPicker;
