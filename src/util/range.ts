/**
 * Creates an array with ascending integers ranging from end to start
 * start is inclusive,
 * end is not
 * @param {number} end - last integer of the range plus 1
 * @param {number} start - first integer of the range 
 * @returns [start ,... , end -1]
 */

export const range = (end: number, start?: number) => {
    const arr = [];
    const _start = start ?? 0;
    for (let i = _start; i < end; i++) {
        arr.push(i);
    }
    return arr;
};