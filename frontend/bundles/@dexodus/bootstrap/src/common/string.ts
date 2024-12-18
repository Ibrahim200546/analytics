export const pluralize = (count: number, forms: [string, string, string]): string => {
    const absCount = Math.abs(count) % 100;
    const remainder = absCount % 10;

    if (absCount > 10 && absCount < 20) {
        return forms[2]; // Родительный падеж множественного числа
    }

    if (remainder === 1) {
        return forms[0]; // Именительный падеж единственного числа
    }

    if (remainder >= 2 && remainder <= 4) {
        return forms[1]; // Родительный падеж единственного числа
    }

    return forms[2]; // Родительный падеж множественного числа
};
