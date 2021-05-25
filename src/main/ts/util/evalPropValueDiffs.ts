import {ObjPropValueDiff} from "./objPropValueDiff";
import {isEqual} from "./isEqual";

export const evalPropValueDiffs = (source: NonNullable<unknown>, target: NonNullable<unknown>): ObjPropValueDiff[] =>
{
    if (typeof source !== "object" || source === null)
    {
        throw new Error(source === null ? "null source object argument" : "source object argument not parsable to object");
    }

    if (typeof target !== "object" || target === null)
    {
        throw new Error(target === null ? "null target object argument" : "target object argument not parsable to object");
    }

    const targetObjEntries: readonly Readonly<[string, Readonly<unknown>]>[] =
        Object.freeze(Object.entries(target));

    return Object.entries(source)
        .filter(srcObjEntry =>
            targetObjEntries.some(targetObjEntry =>
                srcObjEntry[0] === targetObjEntry[0]
                && ! isEqual(srcObjEntry[1], targetObjEntry[1])))
        .map(srcObjEntry => (
            new ObjPropValueDiff(srcObjEntry[0],
                                 srcObjEntry[1],
                                 targetObjEntries.find(targetObjEntry => srcObjEntry[0] === targetObjEntry[0])?.[1])));
};

export {evalPropValueDiffs as default};
