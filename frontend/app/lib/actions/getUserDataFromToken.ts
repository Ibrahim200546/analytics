const getUserDataFromToken = (token: string) => {
    const tokenParts = token.split('.');
    const userData = atob(tokenParts[1]);

    return JSON.parse(userData);
}

export default getUserDataFromToken;
