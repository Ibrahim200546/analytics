"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFunctions = void 0;
exports.dateFunctions = {
    /**
     * Сравнивает две даты в формате строки и возвращает числовое значение, указывающее на их взаимное расположение во времени.
     *
     * @param {string} date1 - Первая дата в формате строки.
     * @param {string} date2 - Вторая дата в формате строки.
     * @returns {number} Возвращает 1, если date1 позже date2, -1, если date1 раньше date2, и 0, если обе даты равны.
     *
     * @example
     * const result = dateFunctions.compareDates('2023-05-19', '2023-05-18');
     * console.log(result); // Вывод: 1
     */
    compareDates: (date1, date2) => {
        const aDate = new Date(date1);
        const bDate = new Date(date2);
        if (aDate > bDate) {
            return 1;
        }
        else if (aDate < bDate) {
            return -1;
        }
        return 0;
    },
};
//# sourceMappingURL=date.js.map