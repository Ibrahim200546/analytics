export interface TimeValue {
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
}

export const mapStringToTimeValue = (string: string): TimeValue => {
    const [hours, minutes, seconds] = string.split(':');

    const parseTimePart = (part: string, min: number, max: number): number | null => {
        return part === '--' ? null : Math.max(min, Math.min(max, parseInt(part, 10)));
    };

    return {
        hours: parseTimePart(hours, 0, 23),
        minutes: parseTimePart(minutes, 0, 59),
        seconds: parseTimePart(seconds, 0, 59),
    };
};

export const mapTimeValueToString = (timeValue: TimeValue): string => {
    const formatTimePart = (part: number | null): string => {
        return part === null ? '--' : part.toString().padStart(2, '0');
    };

    const hours = formatTimePart(timeValue.hours);
    const minutes = formatTimePart(timeValue.minutes);
    const seconds = formatTimePart(timeValue.seconds);

    return `${hours}:${minutes}:${seconds}`;
};
