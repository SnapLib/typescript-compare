import {PropertyValueDifference} from "./propertyDifferences/propertyValueDifference";
import {isEqual} from "./util/isEqual";

/**
 * Consumes 2 non-nullable objects, referred to as the *source* and *target*
 * object, and returns the properties that are present in both, but "altered" in
 * the target object. By altered, that means the property key is the same in
 * both the source and target objects, but it's mapped to a different value in
 * the target object than the source object.
 *
 * @param {NonNullable<Object>} source The object being compared to the passed target object
 * @param {NonNullable<Object>} target The object being compared to the passed source object
 *
 * @returns {PropertyValueDifference[]} An array containing the properties that have
 *          the same keys but differing values between the source and target
 *          objects.
 */
export const propertyValueDifferences = (source: NonNullable<unknown>, target: NonNullable<unknown>): Array<PropertyValueDifference> =>
{
    if (typeof source !== "string" && typeof source !== "object" || source === null)
    {
        throw new Error( ! source ? `${source} source object argument` : "source object argument not parsable to object");
    }

    if (typeof target !== "string" && typeof target !== "object" || target === null)
    {
        throw new Error( ! target ? `${target} target object argument` : "target object argument not parsable to object");
    }

    const targetObjEntries: readonly Readonly<[string, Readonly<unknown>]>[] =
        Object.freeze(Object.entries(target));

    return Object.entries(source)
        .filter(srcObjEntry =>
            targetObjEntries.some(targetObjEntry =>
                srcObjEntry[0] === targetObjEntry[0]
                && ! isEqual(srcObjEntry[1], targetObjEntry[1])))
        .map(srcObjEntry => (
            new PropertyValueDifference(srcObjEntry[0],
                                   srcObjEntry[1],
                                   targetObjEntries.find(targetObjEntry => srcObjEntry[0] === targetObjEntry[0])?.[1])));
};

export {propertyValueDifferences as default};
