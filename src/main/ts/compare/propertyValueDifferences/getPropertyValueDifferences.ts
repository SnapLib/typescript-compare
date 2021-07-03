import type {PropertyValueDifferences} from "../propertyValueDifferences";
import {PropertyValueDifference} from "./propertyValueDifference";
import {isEqual} from "@snaplib/is-equal";

/**
 * Consumes 2 non-null objects and returns the properties that are present in
 * both and have the same keys, but are mapped to differing values.
 *
 * Both the key and value it's mapped to in each object is returned.
 *
 * @remarks
 * Both objects must have enumerable key-value properties. If a `string` is
 * passed as an argument, it's converted into an array.
 *
 * @param {NonNullable<object>} source The non-null object being compared to the
 *        passed target object
 *
 * @param {NonNullable<object>} target The non-null object the source object is
 *        being compared to
 *
 * @returns {PropertyValueDifferences} An object containing the equivalent keys
 *          that are present in both the source and target object but mapped to
 *          differing values as well as what the values they're mapped to in
 *          each object.
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

export default getPropertyValueDifferences;
