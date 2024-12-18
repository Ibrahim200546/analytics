import React from "react";
import styles from "./EclipsePlacement.module.scss";

interface EclipsePlacementProps {
    contents: React.ReactNode[];
    width: number;
    height: number;
    arrowColor?: string;
}

const EclipsePlacement: React.FC<EclipsePlacementProps> = ({ contents, width, height, arrowColor = '#00000000' }) => {
    const radiusX = width / 2;
    const radiusY = height / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const calculatePosition = (angle: number, distanceFromCenter: number = 1) => {
        const x = centerX + radiusX * Math.cos(angle) * distanceFromCenter;
        const y = centerY + radiusY * Math.sin(angle) * distanceFromCenter;
        return { x, y };
    };

    const generateStraightArrow = (startAngle: number, endAngle: number) => {
        const start = calculatePosition(startAngle, .9);
        const end = calculatePosition(endAngle, .9);

        const path = `M${start.x},${start.y} L${end.x},${end.y}`;
        return (
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={`${arrowColor}`} />
                    </marker>
                </defs>
                <path d={path} stroke={`${arrowColor}`} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            </svg>
        );
    };

    const adjustAngle = (angle: number, offset: number) => angle + offset;

    const angles = contents.map((_, index) => (index / contents.length) * 2 * Math.PI - Math.PI / 2);

    return (
        <div
            className={styles.eclipsePlacement}
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            {contents.map((_, index) => {
                const position = calculatePosition(angles[index]);
                const nextIndex = (index + 1) % contents.length;
                const arrow = generateStraightArrow(
                    adjustAngle(angles[index], Math.PI / contents.length * 0.8),  // Смещение начала стрелки
                    adjustAngle(angles[nextIndex], -Math.PI / contents.length * 0.8) // Смещение конца стрелки
                );
                return (
                    <React.Fragment key={index}>
                        <div
                            className={styles.contentItem}
                            style={{ left: `${position.x - 25}px`, top: `${position.y - 25}px` }}
                        >
                            {contents[index]}
                        </div>
                        {arrow}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default EclipsePlacement;
