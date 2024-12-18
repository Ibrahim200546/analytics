import React, {CSSProperties} from "react";
import styles from "./Hexagon.module.scss";

interface HexagonProps {
    size: number;
    borderSize?: number;
    color?: string;
    content?: React.ReactNode;
    style?: CSSProperties;
}

const Hexagon: React.FC<HexagonProps> = (
    {
        size,
        content,
        style,
        color = 'black',
        borderSize = 1,
    },
) => {
    const lines = [0, 60, 120];

    const widthWithoutBorder = (size - borderSize * 2);
    const lineLength = widthWithoutBorder / Math.sqrt(3);

    return (
        <div
            className={styles.hexagon}
            style={{
                width: `${size}px`,
                height: `${lineLength * 2}px`,
                ...style,
            }}
        >
            {lines.map((line, index) => (
                <div key={index} style={{
                    position: "absolute",
                    borderLeft: `${borderSize}px solid ${color}`,
                    borderRight: `${borderSize}px solid ${color}`,
                    width: `${size - borderSize * 2}px`,
                    height: `${lineLength + borderSize}px`,
                    transform: `rotateZ(${line}deg)`,
                    top: `${lineLength / 2}px`,
                }}/>
            ))}
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
};

export default Hexagon;
