const useCombineLoading = (loadings: boolean[]): boolean => {
    for (const loading of loadings) {
        if (loading) {
            return true;
        }
    }

    return false;
}

export default useCombineLoading;
