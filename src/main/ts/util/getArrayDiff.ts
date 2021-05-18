export const getArrayDiff = (source: ReadonlyArray<unknown>, target: ReadonlyArray<unknown>): {index: number, sourceValue: unknown, targetValue: unknown}[] =>
{
    return Array.from(source.entries())
        .filter(srcEntry => srcEntry[1] !== target[srcEntry[0]])
        .map(srcEntry => ({index: srcEntry[0], sourceValue: srcEntry[1], targetValue: target[srcEntry[0]]}));
};

export {getArrayDiff as default};
