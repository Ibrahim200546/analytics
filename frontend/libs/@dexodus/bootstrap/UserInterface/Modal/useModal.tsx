'use client';

import Modal, {ModalSize} from "@/libs/@dexodus/bootstrap/UserInterface/Modal/Modal";
import React, {useState} from "react";
const useModal = (
    content: React.ReactNode,
    header?: React.ReactNode,
    controls?: (options: {close: () => void, closeButton: React.ReactNode}) => React.ReactNode,
    size: ModalSize = ModalSize.Standard,
    onHide = () => {},
) => {
    const [visible, setVisible] = useState<boolean>(false);

    const hide = () => {
        onHide();
        setVisible(false);
    };

    return {
        modal: (
            <Modal
                content={content}
                header={header}
                controls={controls && controls({close: hide, closeButton: <Button onClick={hide}>Close</Button>})}
                visible={visible}
                setVisible={setVisible}
                size={size}
            />
        ),
        setVisible,
        isVisible: visible,
        show: () => setVisible(true),
        hide,
    }
}

import Button from "@/libs/@dexodus/bootstrap/UserInterface/Button";

export default useModal;
