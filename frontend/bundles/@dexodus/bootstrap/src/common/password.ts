export const generatePassword = (length: number, useSpecialSymbols: boolean = false): string => {
    if (length < 1) {
        throw new Error("Password length must be at least 1.");
    }

    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialSymbols = "!@#$%^&*()-_=+[]{}|;:',.<>?/";

    let characterPool = letters + numbers;
    if (useSpecialSymbols) {
        characterPool += specialSymbols;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    return password;
}
