export const range = (end: number, start?: number) => {
    const arr = [];
    const _start = start ?? 0;
    for (let i = _start; i < end; i++) {
        arr.push(i);
    }
    return arr;
};