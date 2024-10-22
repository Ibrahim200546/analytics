import React from "react";
import styles from "./HexagonPyramid.module.scss";
import Hexagon from "@/libs/@dexodus/bootstrap/decorations/Hexagon";

interface HexagonPyramidProps {
    contents: React.ReactNode[];
    hexagonSize: number;
    borderSize?: number;
    color?: string;
}

const pyramidalSequence = (n: number): number => {
    if (n < 1) {
        return 0;
    }

    let level = 1;
    let count = 1;

    while (n > count) {
        level++;
        count += level;
    }

    return level;
}

const HexagonPyramid: React.FC<HexagonPyramidProps> = ({contents = [], hexagonSize, borderSize = 1, color}) => {
    const widthWithoutBorder = (hexagonSize - borderSize * 2);
    const lineLength = widthWithoutBorder / Math.sqrt(3);
    let lineNumber = 0;
    let offset = 0;

    const triangleWidth = pyramidalSequence(contents.length) * hexagonSize;

    return (
        <div
            className={styles.hexagonPyramid}
            style={{
                height: `${pyramidalSequence(contents.length) * lineLength * 1.5 + lineLength / 2}px`,
                width: `${triangleWidth}px`,
            }}
        >
            {contents.map((content, index) => {
                const currentLineNumber = lineNumber;
                const currentOffset = offset;
                offset++;

                if (offset === lineNumber + 1) {
                    offset = 0;
                    lineNumber++;
                }

                return (
                    <Hexagon
                        key={index}
                        style={{
                            top: currentLineNumber * (lineLength * 1.5 + borderSize),
                            left: -currentLineNumber * widthWithoutBorder / 2 + currentOffset * (widthWithoutBorder + borderSize) + triangleWidth / 2 - hexagonSize / 2,
                            position: "absolute",
                        }}
                        size={hexagonSize}
                        color={color}
                        content={content}
                        borderSize={borderSize}
                    />
                );
            })}
        </div>
    );
};

export default HexagonPyramid;
