import {evalPropValueDiffs} from "./propertyDifferences/evalPropValueDiffs";
import type {PropertyDifferences} from "./propertyDifferences/propertyDifferences";
import {isEqual} from "./util/isEqual";
import type {Query} from "./compare/query";

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
    readonly #alteredProperties: Readonly<PropertyDifferences>;

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

    public constructor(sourceObject: NonNullable<SourceType>,
                       targetObject: NonNullable<TargetType>)
    {
        // Ensure source object can be interpreted as enumerable object
        if (typeof sourceObject !== "string" && typeof sourceObject !== "object" || sourceObject === null)
        {
            throw new Error( ! sourceObject ? `${sourceObject} source object argument` : "source object argument not parsable to object");
        }

        // Ensure target object can be interpreted as enumerable object
        if (typeof targetObject !== "string" && typeof targetObject !== "object" || targetObject === null)
        {
            throw new Error( ! targetObject ? `${targetObject} target object argument` : "target object argument not parsable to object");
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
            Object.freeze(Object.fromEntries(evalPropValueDiffs(convertedSource, convertedTarget).map(diff => [diff.key, {sourceValue: diff.sourceValue, targetValue: diff.targetValue}])));

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
     */
    public get source(): Readonly<SourceType> { return this.#srcObj; }

    /**
     * Returns the target object that the source object is being compared to.
     * The returned object is frozen to prevent inadvertently mutating it.
     *
     * @returns {Readonly<Object>>} The target object the source object is being
     *          compared to.
     */
    public get target(): Readonly<TargetType> { return this.#targetObj; }

    /**
     * Returns the properties that are present in the source object but not the
     * target object it's being compared to.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          present in the source object but not the target object.
     */
    public get omittedProperties(): Readonly<{readonly [srcPropKey: string]: Readonly<unknown>}> { return this.#omittedProperties; }

    /**
     * Returns the properties that are present in the target object but not the
     * source object that's being compared to it.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          not present in the source object but are present in the target
     *          object.
     */
    public get extraProperties(): Readonly<{readonly [targetPropKey: string]: Readonly<unknown>}> { return this.#extraProperties; }

    /**
     * Returns the properties that are present in both the source and target
     * object that are equivalent. That is, keys that are present in both the
     * source and target object that are also mapped to equivalent values.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          present and equivalent in the source and target object.
     */
    public get sharedProperties(): Readonly<{readonly [sharedPropKey: string]: Readonly<unknown>}> { return this.#sharedProperties; }

    /**
     * Returns the properties that are present in both the source and target
     * object that have differing values. That is, keys that are present in both
     * the source and target object that are mapped to differing values.
     *
     * @returns {Readonly<Object>>} An object containing the properties that are
     *          present in the source and target object but are mapped to
     *          differing values.
     */
    public get alteredProperties(): Readonly<PropertyDifferences> { return this.#alteredProperties; }

    /**
     * Returns a boolean representing whether omitted, extra, shared, and/or
     * altered properties are present in the source and target objects being
     * compared.
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
