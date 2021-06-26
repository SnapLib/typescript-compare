import type {PropertyValueDifferences} from "../propertyValueDifferences";
import {PropertyValueDifference} from "./propertyValueDifference";
import {isEqual} from "../../util/isEqual";

/**
 * Consumes 2 non-nullable objects, referred to as the *source* and *target*
 * object, and returns the properties that are present in both, but "altered" in
 * the target object. By altered, that means the property key is the same in
 * both the source and target objects, but it's mapped to a different value in
 * the target object than the source object.
 *
 * @param {NonNullable<object>} source The object being compared to the passed
 *        target object
 *
 * @param {NonNullable<object>} target The object being compared to the passed
 *        source object
 *
 * @returns {PropertyValueDifferences} An object containing the keys present in
 *          both the source and target object mapped to what their values are in
 *          each corresponding object.
 */
export const getPropertyValueDifferences = (source: NonNullable<unknown>, target: NonNullable<unknown>): PropertyValueDifferences =>
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

    const differingSrcPropertyEntries = Object.freeze(Object.entries(source)
        .filter(srcObjEntry =>
            targetObjEntries.some(targetObjEntry =>
                srcObjEntry[0] === targetObjEntry[0]
                && ! isEqual(srcObjEntry[1], targetObjEntry[1]))));

    const propertyDifferencesArray = Object.freeze(differingSrcPropertyEntries.map(srcObjEntry => (
            new PropertyValueDifference(srcObjEntry[0],
                                        srcObjEntry[1],
                                        targetObjEntries.find(targetObjEntry => srcObjEntry[0] === targetObjEntry[0])?.[1]))));

    return Object.fromEntries(propertyDifferencesArray.map(propDiff => propDiff.entry));
};

export {getPropertyValueDifferences as default};
