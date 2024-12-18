export const arrayChunks = <T>(array: T[], chunkLength: number): T[][] => {
    const copyArray = [...array];
    const chunks: T[][] = [];
    let chunk: T[] = [];

    while (copyArray.length) {
        chunk.push(copyArray.shift() as T);
        if (chunk.length === chunkLength) {
            chunks.push(chunk);
            chunk = [];
        }
    }

    if (chunk.length) {
        chunks.push(chunk);
    }

    return chunks;
}

export const arrayPad = <T>(array: T[], length: number, fill: T): T[] => {
    return [...array, ...Array(Math.max(0, length - array.length)).fill(fill)];
}
