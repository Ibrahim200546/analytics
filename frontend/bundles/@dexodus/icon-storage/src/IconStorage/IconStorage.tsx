import React from "react";

export type Storage = {
    [key: string]: any;
};

interface IconStorageProps {
    name: string;
    storage: Storage;
}

const IconStorage: React.FC<IconStorageProps> = ({name, storage}) => {
    return name in storage ? storage[name] : '';
};

export default IconStorage;
