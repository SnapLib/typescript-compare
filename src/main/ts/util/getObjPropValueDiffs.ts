export const getObjPropValueDiffs = (source: Readonly<{[key: string]: unknown}>, target: Readonly<{[key: string]: unknown}>): {key: string, sourceValue: unknown, targetValue: unknown}[] =>
{
    const targetObjEntries: ReadonlyArray<[string, unknown]> = Object.entries(target);

    return Object.entries(source).filter(srcObjEntry =>
        targetObjEntries.some(targetObjEntry =>
            srcObjEntry[0] === targetObjEntry[0]
            && srcObjEntry[1] !== targetObjEntry[1]))
        .map(srcObjEntry => ({key: srcObjEntry[0],
                              sourceValue: srcObjEntry[1],
                              targetValue: target[srcObjEntry[0]]}));
};

export {getObjPropValueDiffs as default};
