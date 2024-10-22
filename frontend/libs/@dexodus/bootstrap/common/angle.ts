export const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360;

export const shortestAngle = (currentAngle: number, targetAngle: number): number => {
    const normalizedCurrent = normalizeAngle(currentAngle);
    const normalizedTarget = normalizeAngle(targetAngle);

    let difference = normalizedTarget - normalizedCurrent;

    if (difference > 180) {
        difference -= 360;
    } else if (difference < -180) {
        difference += 360;
    }

    return difference;
};
