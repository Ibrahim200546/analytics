export const getBirthdayFromIin = (iin: string): string => {
    const generation = 19 + Math.floor((parseInt(iin[6]) - 1) / 2);
    const year = (generation - 1) * 100 + parseInt(iin.substring(0, 2));
    const month = iin.substring(2, 4);
    const day = iin.substring(4, 6);

    return `${year}-${month}-${day} 12:00:00`;
}

export const getGenderFromIin = (iin: string): string => {
    return (parseInt(iin[6]) - 1) % 2 == 0 ? 'male' : 'female';
}

