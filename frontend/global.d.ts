namespace NextJS {
    type SFC<T> = (T) => (React.ReactNode | Promise<React.ReactNode>);
}

declare module "next13-progressbar" {
    const Next13ProgressBar: React.ComponentType<any>;
    export default Next13ProgressBar;
}

declare module "reactjs-popup" {
    const Popup: React.ComponentType<any>;
    export default Popup;
}

declare module "react-image-crop" {
    export interface Crop {
        x: number;
        y: number;
        width: number;
        height: number;
        unit?: "px" | "%";
    }

    const ReactCrop: React.ComponentType<any>;
    export default ReactCrop;
}

declare module "next-redux-wrapper" {
    export const createWrapper: any;
}

declare module "tinycolor2" {
    const tinycolor: (color?: string) => {getBrightness: () => number};
    export default tinycolor;
}

declare module "uuid" {
    export function v4(): string;
}

declare module "react-color" {
    interface Color {
        hex: string;
    }

    interface ChromePickerProps {
        color?: string;
        onChange?: (color: Color) => void;
        onChangeComplete?: (color: Color) => void;
    }

    export const ChromePicker: React.ComponentType<ChromePickerProps>;
}

declare module "@/packages/@dexodus/native-translation-package/src/components/Translate" {
    export type TranslateComponent = () => React.ReactNode;
}
