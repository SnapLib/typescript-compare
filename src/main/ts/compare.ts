import {PropertyDifference} from "./propertyDifferences/propertyDifference";
import {evalPropValueDiffs} from "./propertyDifferences/evalPropValueDiffs";
import {isEqual} from "./util/isEqual";
import type {Query} from "./compare/query";

export class Compare<SourceType, TargetType>
{
    /**
     * @private
     * @readonly
     */
    readonly #srcObj: Readonly<SourceType>;

    /**
     * @private
     * @readonly
     */
    readonly #targetObj: Readonly<TargetType>;

    /**
     * @private
     * @readonly
     */
    readonly #omittedProperties: Readonly<{readonly [srcPropKey: string]: Readonly<unknown>}>;

    /**
     * @private
     * @readonly
     */
    readonly #hasOmittedProperties: boolean;

    /**
     * @private
     * @readonly
     */
    readonly #omittedKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    readonly #extraProperties: Readonly<{readonly [targetPropKey: string]: Readonly<unknown>}>;

    /**
     * @private
     * @readonly
     */
    readonly #hasExtraProperties: boolean;

    /**
     * @private
     * @readonly
     */
    readonly #extraKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    readonly #sharedProperties: Readonly<{readonly [sharedPropKey: string]: Readonly<unknown>}>;

    /**
     * @private
     * @readonly
     */
    readonly #hasSharedProperties: boolean;

    /**
     * @private
     * @readonly
     */
    readonly #sharedPropertyKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    readonly #alteredProperties: readonly Readonly<PropertyDifference>[];

    /**
     * @private
     * @readonly
     */
    readonly #alteredPropertyKeys: ReadonlyArray<string>;

    // TODO Make ownPropertiesOnly walk prototype chain if set to false.
    public constructor(sourceObject: NonNullable<SourceType>,
                       targetObject: NonNullable<TargetType>)
    {
        if (typeof sourceObject !== "string" && typeof sourceObject !== "object" || sourceObject === null)
        {
            throw new Error( ! sourceObject ? `${sourceObject} source object argument` : "source object argument not parsable to object");
        }

        if (typeof targetObject !== "string" && typeof targetObject !== "object" || targetObject === null)
        {
            throw new Error( ! targetObject ? `${targetObject} target object argument` : "target object argument not parsable to object");
        }

        this.#srcObj = Object.freeze(sourceObject);
        this.#targetObj = Object.freeze(targetObject);

        const convertedSource: Readonly<SourceType> | ReadonlyArray<string> = Object.freeze(
            typeof sourceObject === "string" ? Array.from(sourceObject) : sourceObject);

        const convertedTarget: Readonly<TargetType> | ReadonlyArray<string> = Object.freeze(
            typeof targetObject === "string" ? Array.from(targetObject) : targetObject);

        const srcEntries = Object.freeze(Object.entries(sourceObject));

        const targetEntries = Object.freeze(Object.entries(targetObject));

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

        this.#omittedKeys = Object.freeze(Object.keys(this.#omittedProperties));

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

        this.#extraKeys = Object.freeze(Object.keys(this.#extraProperties));

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

        this.#sharedPropertyKeys = Object.freeze(Object.keys(this.#sharedProperties));

        this.#alteredProperties =
            Object.freeze(evalPropValueDiffs(convertedSource, convertedTarget));

        this.#alteredPropertyKeys = Object.freeze(
            this.#alteredProperties.map(diff => diff.key));
    }

    public get source(): Readonly<SourceType> { return this.#srcObj; }
    public get target(): Readonly<TargetType> { return this.#targetObj; }
    public get omittedProperties(): Readonly<{readonly [srcPropKey: string]: Readonly<unknown>}> { return this.#omittedProperties; }
    public get omittedKeys(): ReadonlyArray<string> { return this.#omittedKeys; }
    public get extraProperties(): Readonly<{readonly [targetPropKey: string]: Readonly<unknown>}> { return this.#extraProperties; }
    public get extraKeys(): ReadonlyArray<string> { return this.#extraKeys; }
    public get sharedProperties(): Readonly<{readonly [sharedPropKey: string]: Readonly<unknown>}> { return this.#sharedProperties; }
    public get sharedPropertyKeys(): ReadonlyArray<string> { return this.#sharedPropertyKeys; }
    public get alteredProperties(): readonly Readonly<PropertyDifference>[] { return this.#alteredProperties; }
    public get alteredPropertyKeys(): ReadonlyArray<string> { return this.#alteredPropertyKeys; }

    public readonly has: Query<boolean> = Object.freeze({
        omittedProperties: (): boolean => this.#hasOmittedProperties,

        extraProperties: (): boolean => this.#hasExtraProperties,

        sharedProperties: (): boolean => this.#hasSharedProperties,

        alteredProperties: (): boolean => this.#alteredProperties.length !== 0
    });

    public readonly count: Query<number> = Object.freeze({
        omittedProperties: (): number => this.#omittedKeys.length,

        extraProperties: (): number => this.#extraKeys.length,

        sharedProperties: (): number => this.#sharedPropertyKeys.length,

        alteredProperties: (): number => this.#alteredProperties.length
    });
}

export {isEqual} from "./util/isEqual";

export {Compare as default};
