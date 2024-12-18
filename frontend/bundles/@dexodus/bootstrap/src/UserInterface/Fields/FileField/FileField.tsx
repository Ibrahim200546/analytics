"use client";

import React, {useState} from "react";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import {Dropzone, ExtFile, FileMosaic} from "@files-ui/react";
import {File} from "@dexodus/entity-form-common-fields/src/types/file";
import useModal from "../../../UserInterface/Modal/useModal";
import {ModalSize} from "../../../UserInterface/Modal/Modal";

interface FileFieldProps extends FieldComponentProps {
    uploadUrl: string;
    maxFiles?: number | null;
    maxFileSize?: number;
    accept?: string[];
    disabled?: boolean;
}

const DEFAULT_MAX_FILES = 1;
const DEFAULT_MAX_SIZE = 32 * 1024 * 1024; // 32 MByte * 1024 KByte * 1024 Byte

const FileField: FieldComponent<FileFieldProps> = (
    {
        value,
        onChange,
        uploadUrl,
        maxFiles = DEFAULT_MAX_FILES,
        maxFileSize = DEFAULT_MAX_SIZE,
        accept = [],
        disabled = false,
    },
) => {
    const [fileRemoteIds, setFileRemoteIds] = useState<{[fileId: number]: number}>({});
    const defaultFiles = (value ?? []).map((file: File) => {
        return {
            id: file.id,
            name: file.originalName,
            type: file.mimeType,
            uploadStatus: 'success',
            downloadUrl: file.temporaryUrl,
        } as ExtFile;
    });
    const [currentViewFile, setCurrentViewFile] = useState<string|null>(null);
    const [files, setFiles] = React.useState(defaultFiles);

    const updateFiles = (incommingFiles: any) => {
        if (incommingFiles.length > 0) {
            for (let file of files) {
                if (!incommingFiles.find((incommingFile: any) => incommingFile.id === file.id)) {
                    incommingFiles = [...incommingFiles, file];
                }
            }
        }

        setFiles(incommingFiles);
    };

    const {modal, show} = useModal((
        <div>
            {currentViewFile && <a href={currentViewFile} target="_blank"><img src={currentViewFile} alt={currentViewFile} style={{maxWidth: '100%'}}/></a>}
        </div>
    ), <></>, () => <></>, ModalSize.Large, () => {
        setCurrentViewFile(null);
    })

    return (
        <div>
            <Dropzone
                maxFileSize={maxFileSize}
                onChange={disabled ? undefined : updateFiles}
                value={files}
                maxFiles={maxFiles ?? undefined}
                accept={accept.join(",")}
                uploadConfig={{
                    url: uploadUrl,
                    autoUpload: true,
                }}
                behaviour={"add"}
                localization="RU-ru"
                onUploadFinish={uploadedFiles => {
                    if (disabled) {
                        return;
                    }

                    for (const uploadedFile of uploadedFiles) {
                        setFileRemoteIds(fileRemoteIds => ({...fileRemoteIds, [uploadedFile.id as number]: uploadedFile.serverResponse?.payload?.id}))
                    }

                    let fileIds = uploadedFiles.map(uploadedFile => (
                        `/api/files/${uploadedFile.serverResponse?.payload?.id}`
                    ));

                    for (const file of files) {
                        if ('file' in file) {
                            fileIds = [...fileIds, `/api/files/${fileRemoteIds[file.id]}`];
                        } else {
                            fileIds = [...fileIds, `/api/files/${file.id}`];
                        }
                    }

                    onChange(fileIds);
                }}
            >
                {files.map((file: any) => (
                    <FileMosaic
                        {...file}
                        key={file.id}
                        preview
                        onSee={file.downloadUrl ? (() => {
                            setCurrentViewFile(file.downloadUrl);
                            show();
                        }) : undefined}
                        onDelete={disabled ? undefined : () => {
                            setFiles((files: any[]) => files.filter(newFile => newFile.id !== file.id))

                            let fileIds: string[] = [];
                            for (const fileUnit of files) {
                                if (fileUnit.id === file.id) {
                                    continue;
                                }

                                if ('file' in fileUnit) {
                                    fileIds = [...fileIds, `/api/files/${fileRemoteIds[fileUnit.id]}`];
                                } else {
                                    fileIds = [...fileIds, `/api/files/${fileUnit.id}`];
                                }
                            }

                            onChange(fileIds);
                        }}
                    />
                ))}
            </Dropzone>
            {modal}
        </div>
    );
};

export default FileField;
