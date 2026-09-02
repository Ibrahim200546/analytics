"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iinFunctions = void 0;
exports.iinFunctions = {
    getBirthdayFromIin: (iin) => {
        const generation = 19 + Math.floor((parseInt(iin[6]) - 1) / 2);
        const year = (generation - 1) * 100 + parseInt(iin.substring(0, 2));
        const month = iin.substring(2, 4);
        const day = iin.substring(4, 6);
        return `${year}-${month}-${day} 12:00:00`;
    },
    getGenderFromIin: (iin) => {
        return (parseInt(iin[6]) - 1) % 2 == 0 ? 'male' : 'female';
    },
};
//# sourceMappingURL=iin.js.map