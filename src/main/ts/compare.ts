/**
 * This is the primary exported module intended to be imported and used by other
 * libraries/modules. This module contains the sole `Compare` class used to
 * simplify the process of querying the differences and similarities between 2
 * objects. Refer to the {@link Compare} documentation for more in depth details
 * regarding its implementation.
 *
 * @module
 * @author Snap
 */

import {getPropertyValueDifferences} from "./propertyValueDifferences";
import {isEqual} from "./util/isEqual";
import type {PropertyValueDifferences} from "./propertyValueDifferences";
import type {Query} from "./compare/query";

/**
 * The `Compare` class compares 2 objects to each other. It simplifies the
 * process of querying the differences and similarities between the 2 objects
 * being compared. The types of relationships between the objects is relative to
 * how the ***source*** *object compares to the* ***target*** *object*. There
 * are 4 types of relations that can be queried via properties of a `Compare`
 * object:
 *
 * 1. {@link omittedProperties}
 *
 *     Properties that are present in the *source* object but not in the
 *     *target* object are considered "omitted" properties. As in they're
 *     properties that are present in the source object but *omitted* in the
 *     target object.
 *
 *     ```typescript
 *     const obj1 = { prop1: 1,
 *                    prop2: "foo" };
 *
 *     const obj2 = { prop1: 1 };
 *
 *     console.log(new Compare(obj1, obj2).omittedProperties);
 *     // prints: { prop2: "foo" }
 *     ```
 *
 * 1. {@link extraProperties}
 *
 *     Properties that are not present in the *source* object but are present in
 *     the *target* object are considered "extra" properties. As in they're
 *     *extra* properties that are present in the target object but not in the
 *     source object.
 *
 *     ```typescript
 *     const obj1 = { prop1: 1,
 *                    prop2: "foo" };
 *
 *     const obj2 = { prop1: 1,
 *                    prop2: "foo",
 *                    prop3: true };
 *
 *     console.log(new Compare(obj1, obj2).extraProperties);
 *     // prints: { prop3: true }
 *     ```
 *
 * 1. {@link sharedProperties}
 *
 *     Properties that are present in both the *source* and *target* object that
 *     are equivalent are considered "shared" properties. If there are keys that
 *     are present in both the source and target objects *that are also mapped*
 *     *to equivalent values* then the key-value pairs are considered shared
 *     properties.
 *
 *     ```typescript
 *     const obj1 = { prop1: 1,
 *                    prop2: "foo",
 *                    prop3: false };
 *
 *     const obj2 = { prop1: 1,
 *                    prop2: "foo",
 *                    prop3: true };
 *
 *     console.log(new Compare(obj1, obj2).sharedProperties);
 *     // prints: { prop1: 1,
 *     //           prop2: "foo" }
 *     ```
 *
 * 1. {@link alteredProperties}
 *
 *     Properties that are present in both the *source* and *target* object that
 *     contain differing values are considered "altered" properties. If there
 *     are keys that are present in both the source and target objects *that*
 *     *are mapped to differing values* then the key-value pairs are considered
 *     altered properties.
 *
 *     ```typescript
 *     const obj1 = { prop1: 1,
 *                    prop2: "foo",
 *                    prop3: false };
 *
 *     const obj2 = { prop1: 1,
 *                    prop2: "foo",
 *                    prop3: true };
 *
 *     console.log(new Compare(obj1, obj2).alteredProperties);
 *     // prints: { prop3: { sourceValue: false,
 *     //                    targetValue: true } }
 *     ```
 *
 * @template SourceType The type of object being compared to the target object.
 *
 * @template TargetType The type of object the source object is being compared
 *                      to.
 *
 * @classdesc
 * @author Snap
 */
export class Compare<SourceType, TargetType>
{
    /**
     * Contains the source object passed to the constructor during
     * instantiation.
     *
     * @private
     * @readonly
     */
    readonly #srcObj: Readonly<SourceType>;

    /**
     * Contains the target object passed to the constructor during
     * instantiation.
     *
     * @private
     * @readonly
     */
    readonly #targetObj: Readonly<TargetType>;

    /**
     * An object containing the keys and their mapped values that are present in
     * the source object but not the target object.
     *
     * @private
     * @readonly
     */
    readonly #omittedProperties: Readonly<{readonly [srcPropKey: string]: Readonly<unknown>}>;

    /**
     * Boolean indicating if there are properties in the source object
     * that are not present in the target object.
     *
     * @private
     * @readonly
     */
    readonly #hasOmittedProperties: boolean;

    /**
     * Number of properties the source object contains that aren't present in
     * the target object it's being compared to.
     *
     * @private
     * @readonly
     */
    readonly #omittedPropsCount: number;

    /**
     * An object containing the keys and their mapped values that are present in
     * the target object but not the source object.
     *
     * @private
     * @readonly
     */
    readonly #extraProperties: Readonly<{readonly [targetPropKey: string]: Readonly<unknown>}>;

    /**
     * Boolean indicating if there are properties in the target object
     * that are not present in the source object.
     *
     * @private
     * @readonly
     */
    readonly #hasExtraProperties: boolean;

    /**
     * Number of properties the target object contains that aren't present in
     * the source object being compared to it.
     *
     * @private
     * @readonly
     */
    readonly #extraPropsCount: number;

    /**
     * An object containing properties that are present in both the source and
     * target objects being compared that are equivalent. That is, Keys that are
     * present in both the source and target objects that are mapped to
     * equivalent values.
     *
     * @private
     * @readonly
     */
    readonly #sharedProperties: Readonly<{readonly [sharedPropKey: string]: Readonly<unknown>}>;

    /**
     * Boolean indicating if there are equivalent properties in the source
     * and target object.
     *
     * @private
     * @readonly
     */
    readonly #hasSharedProperties: boolean;

    /**
     * Number of properties that both the source and target object contain that
     * are equivalent.
     *
     * @private
     * @readonly
     */
    readonly #sharedPropertiesCount: number;

    /**
     * An object containing properties whose keys are present in both the source
     * and target objects, but are mapped to differing values.
     *
     * @private
     * @readonly
     */
    readonly #alteredProperties: Readonly<PropertyValueDifferences>;

    /**
     * Boolean indicating if there are properties in the source and target
     * object mapped to differing values.
     *
     * @private
     * @readonly
     */
    readonly #hasAlteredProperties: boolean;

    /**
     * Number of properties that are present in both the source and target
     * objects, but are mapped to differing values.
     *
     * @private
     * @readonly
     */
    readonly #alteredPropertiesCount: number;

    /**
     * Constructs an instance of a `Compare` object. The only required arguments
     * are 2 "comparable" non-null objects to compare to each other. As long as
     * the passed arguments can be interpreted as sets of enumerable properties
     * (key-value pairs) then they're considered comparable.
     *
     * @remarks
     * Strings are converted to string arrays where each character of the string
     * is mapped to an index that corresponds to its position in the string. So
     * it's possible to compare strings to each other (or other objects).
     *
     * @template SourceType The type of object being compared to the target
     *                      object.
     *
     * @template TargetType The type of object the source object is being
     *                      compared to.
     *
     * @param sourceObject - The object being compared to the target object.
     *
     * @param targetObject - The object the source object is being compared to.
     *
     * @returns {Compare<SourceType, TargetType>>} Returns instantiated
     *          `Compare` object.
     *
     * @throws {TypeError} If source or target object is an invalid type that
     *         can't be interpreted as an enumerable set of properties (key
     *         value pairs).
     *
     * @public
     * @constructor
     */
    public constructor(sourceObject: NonNullable<SourceType>,
                       targetObject: NonNullable<TargetType>)
    {
        // Ensure source object can be interpreted as enumerable object
        if (typeof sourceObject !== "string" && typeof sourceObject !== "object" || sourceObject === null)
        {
            throw new TypeError( ! sourceObject ? `${sourceObject} source object argument` : "source object argument not parsable to object");
        }

        // Ensure target object can be interpreted as enumerable object
        if (typeof targetObject !== "string" && typeof targetObject !== "object" || targetObject === null)
        {
            throw new TypeError( ! targetObject ? `${targetObject} target object argument` : "target object argument not parsable to object");
        }

        this.#srcObj = Object.freeze(sourceObject);
        this.#targetObj = Object.freeze(targetObject);

        // Convert source object to string array if source argument is a string
        const convertedSource: Readonly<SourceType> | ReadonlyArray<string> = Object.freeze(
            typeof sourceObject === "string" ? Array.from(sourceObject) : sourceObject);

        // Convert target object to string array if target argument is a string
        const convertedTarget: Readonly<TargetType> | ReadonlyArray<string> = Object.freeze(
            typeof targetObject === "string" ? Array.from(targetObject) : targetObject);

        const srcEntries = Object.freeze(Object.entries(sourceObject));

        const targetEntries = Object.freeze(Object.entries(targetObject));

        // Create new object out of entries whose keys are in source object but
        // not in target object.
        this.#omittedProperties = Object.freeze(
            Object.fromEntries(srcEntries
                .filter(srcEntry =>
                    ! Object.prototype.hasOwnProperty.call(convertedTarget, srcEntry[0])
                    && ! (srcEntry[0] in convertedTarget))));

        this.#hasOmittedProperties = (() => {
            for (const omittedProp in this.#omittedProperties) {
                return true;
            }

            return false;
        })();

        this.#omittedPropsCount = Object.keys(this.#omittedProperties).length;

        // Create new object out of entries whose keys are in target object but
        // not in source object.
        this.#extraProperties = Object.freeze(
            Object.fromEntries(targetEntries
                .filter(targetEntry =>
                    ! Object.prototype.hasOwnProperty.call(convertedSource, targetEntry[0])
                    && ! (targetEntry[0] in convertedSource))));

        this.#hasExtraProperties = (() => {
            for (const extraProp in this.#extraProperties) {
                return true;
            }

            return false;
        })();

        this.#extraPropsCount = Object.keys(this.#extraProperties).length;

        // Create new object out of entries whose keys are in source and target
        // object and are also mapped to equivalent values.
        this.#sharedProperties = Object.freeze(
            Object.fromEntries(srcEntries
                .filter(srcEntry => targetEntries
                    .some(targetEntry => srcEntry[0] === targetEntry[0]
                        && isEqual(srcEntry[1], targetEntry[1])))));

        this.#hasSharedProperties = (() => {
            for (const sharedProp in this.#sharedProperties) {
                return true;
            }

            return false;
        })();

        this.#sharedPropertiesCount = Object.keys(this.#sharedProperties).length;

        this.#alteredProperties =
            Object.freeze(getPropertyValueDifferences(convertedSource, convertedTarget));

        this.#hasAlteredProperties = (() => {
            for (const alteredProp in this.#alteredProperties) {
                return true;
            }

            return false;
        })();

        this.#alteredPropertiesCount = Object.keys(this.#alteredProperties).length;
    }

    /**
     * Returns the source object being compared to the target object. The
     * returned object is frozen to prevent inadvertently mutating it.
     *
     * @returns {Readonly<Object>>} The source object being compared to the
     *          target object.
     *
     * @public
     */
    public get source(): Readonly<SourceType> { return this.#srcObj; }

    /**
     * Returns the target object that the source object is being compared to.
     * The returned object is frozen to prevent inadvertently mutating it.
     *
     * @returns {Readonly<Object>>} The target object the source object is being
     *          compared to.
     *
     * @public
     */
    public get target(): Readonly<TargetType> { return this.#targetObj; }

    /**
     * Returns the properties that are present in the source object but not the
     * target object it's being compared to.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          present in the source object but not the target object.
     *
     * @public
     */
    public get omittedProperties(): Readonly<{readonly [srcPropKey: string]: Readonly<unknown>}> { return this.#omittedProperties; }

    /**
     * Returns the properties that are present in the target object but not the
     * source object that's being compared to it.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          not present in the source object but are present in the target
     *          object.
     *
     * @public
     */
    public get extraProperties(): Readonly<{readonly [targetPropKey: string]: Readonly<unknown>}> { return this.#extraProperties; }

    /**
     * Returns the properties that are present in both the source and target
     * object that are equivalent. That is, keys that are present in both the
     * source and target object that are also mapped to equivalent values.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          present and equivalent in the source and target object.
     *
     * @public
     */
    public get sharedProperties(): Readonly<{readonly [sharedPropKey: string]: Readonly<unknown>}> { return this.#sharedProperties; }

    /**
     * Returns the properties that are present in both the source and target
     * object that have differing values. That is, keys that are present in both
     * the source and target object that are mapped to differing values.
     *
     * @remarks The key of the property and property value from the source and
     *          target object is returned.
     *
     * @returns {Readonly<Object>>} An object containing the keys that are
     *          present in the source and target object and the differing values
     *          they are mapped to in the source and target object.
     *
     * @public
     */
    public get alteredProperties(): Readonly<PropertyValueDifferences> { return this.#alteredProperties; }

    /**
     * Returns a boolean representing whether omitted, extra, shared, and/or
     * altered properties are present in the source and target objects being
     * compared.
     *
     * @property {boolean} has.omittedProperties() - `boolean` indicating
     *           whether the source object contains properties that aren't
     *           present in the target object it's being compared to.
     *
     * @property {boolean} has.extraProperties() - `boolean` indicating
     *           whether the source object does not contain properties that are
     *           present in the target object it's being compared to.
     *
     * @property {boolean} has.sharedProperties() - `boolean` indicating
     *           whether the source and target object contain equivalent
     *           properties.
     *
     * @property {boolean} has.alteredProperties() - `boolean` indicating
     *           whether the source and target object contain equivalent
     *           keys that are mapped to differing values.
     *
     * @public
     * @readonly
     */
    public readonly has: Query<boolean> = Object.freeze({
        omittedProperties: (): boolean => this.#hasOmittedProperties,

        extraProperties: (): boolean => this.#hasExtraProperties,

        sharedProperties: (): boolean => this.#hasSharedProperties,

        alteredProperties: (): boolean => this.#hasAlteredProperties
    });

    /**
     * Returns a number representing the amount of omitted, extra, shared,
     * and/or altered properties that are present in the source and target
     * objects being compared.
     *
     * @property {number} count.omittedProperties() - number of properties that
     *           are present in the source object, but aren't present in the
     *           target object it's being compared to.
     *
     * @property {number} count.extraProperties() - number of properties that
     *           are not present in the source object, but are present in the
     *           target object it's being compared to.
     *
     * @property {number} count.sharedProperties() - number of properties that are
     *           present in both the source and target object that are
     *           equivalent.
     *
     * @property {number} count.alteredProperties() - number of keys present in
     *           both the the source and target object that are mapped to
     *           differing values.
     *
     * @public
     * @readonly
     */
    public readonly count: Query<number> = Object.freeze({
        omittedProperties: (): number => this.#omittedPropsCount,

        extraProperties: (): number => this.#extraPropsCount,

        sharedProperties: (): number => this.#sharedPropertiesCount,

        alteredProperties: (): number => this.#alteredPropertiesCount
    });
}

export {isEqual} from "./util/isEqual";

export {Compare as default};
