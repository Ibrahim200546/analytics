export const convertNumberToPrice = (number: number|null, currency: string): string => {
    if (!number) {
        return '';
    } else {
        const price = number.toString();
        let textPrice = '';
        let offsetAfter = 3;

        for (let i = price.length - 1; i >= 0; i--) {
            textPrice = price[i] + textPrice;
            offsetAfter--;

            if (offsetAfter === 0) {
                offsetAfter = 3;
                textPrice = ' ' + textPrice;
            }
        }

        return textPrice.trimStart() + ` ${currency}`;
    }
}
