import {PropertyDifference} from "./propertyDifferences/propertyDifference";
import {evalPropValueDiffs} from "./propertyDifferences/evalPropValueDiffs";
import type {Query} from "./compare/query";

export class Compare<SourceType, TargetType>
{
    /**
     * @private
     * @readonly
     */
    private readonly _srcObj: Readonly<SourceType>;

    /**
     * @private
     * @readonly
     */
    private readonly _targetObj: Readonly<TargetType>;

    /**
     * @private
     * @readonly
     */
    private readonly _omittedKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    private readonly _addedKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    private readonly _alteredProperties: readonly Readonly<PropertyDifference>[];

    /**
     * @private
     * @readonly
     */
    private readonly _alteredPropValueKeys: ReadonlyArray<string>;

    /**
     * @private
     * @readonly
     */
    private readonly _sharedProperties: ReadonlyArray<string>;

    // TODO Make ownPropertiesOnly walk prototype chain if set to false.
    public constructor(sourceObject: NonNullable<SourceType>,
                       targetObject: NonNullable<TargetType>,
                       options: {enumerableOnly: boolean, ownPropertiesOnly: boolean} = {enumerableOnly: true, ownPropertiesOnly: true})
    {
        if (typeof sourceObject !== "string" && typeof sourceObject !== "object" || sourceObject === null)
        {
            throw new Error( ! sourceObject ? `${sourceObject} source object argument` : "source object argument not parsable to object");
        }

        if (typeof targetObject !== "string" && typeof targetObject !== "object" || targetObject === null)
        {
            throw new Error( ! targetObject ? `${targetObject} target object argument` : "target object argument not parsable to object");
        }

        this._srcObj = Object.freeze(sourceObject);
        this._targetObj = Object.freeze(targetObject);

        const convertedSource: Readonly<SourceType> | ReadonlyArray<string> = Object.freeze(
            typeof sourceObject === "string" ? Array.from(sourceObject) : sourceObject);

        const convertedTarget: Readonly<TargetType> | ReadonlyArray<string> = Object.freeze(
            typeof targetObject === "string" ? Array.from(targetObject) : targetObject);

        const srcKeys: ReadonlyArray<string> =
            Object.freeze(options?.enumerableOnly ? Object.keys(sourceObject) : Object.getOwnPropertyNames(sourceObject));

        const targetKeys: ReadonlyArray<string> =
            Object.freeze(options?.enumerableOnly ? Object.keys(targetObject) : Object.getOwnPropertyNames(targetObject));

        this._omittedKeys = Object.freeze(
            srcKeys.filter(srcObjKey =>
                options.ownPropertiesOnly
                ? ! Object.prototype.hasOwnProperty.call(convertedTarget, srcObjKey)
                : ! (srcObjKey in convertedTarget)));

        this._addedKeys = Object.freeze(
            targetKeys.filter(targetObjKey =>
                options.ownPropertiesOnly
                ? ! Object.prototype.hasOwnProperty.call(convertedSource, targetObjKey)
                : ! (targetObjKey in convertedSource)));

        this._alteredProperties =
            Object.freeze(evalPropValueDiffs(sourceObject, targetObject));

        this._alteredPropValueKeys =
            Object.freeze(this._alteredProperties.map(diff => diff.key));

        this._sharedProperties = Object.freeze(
            srcKeys.filter(srcObjKey => srcObjKey in convertedTarget && ! this._alteredPropValueKeys.includes(srcObjKey)));
    }

    public get source(): Readonly<SourceType> { return this._srcObj; }
    public get target(): Readonly<TargetType> { return this._targetObj; }
    public get omittedKeys(): ReadonlyArray<string> { return this._omittedKeys; }
    public get addedKeys(): ReadonlyArray<string> { return this._addedKeys; }
    public get sharedProperties(): ReadonlyArray<string> { return this._sharedProperties; }
    public get alteredProperties(): readonly Readonly<PropertyDifference>[] { return this._alteredProperties; }
    public get alteredPropValueKeys(): ReadonlyArray<string> { return this._alteredPropValueKeys; }

    public readonly has: Query<boolean> = Object.freeze({
        omittedKeys: (): boolean => this._omittedKeys.length !== 0,

        addedKeys: (): boolean => this._addedKeys.length !== 0,

        sharedProperties: (): boolean => this._sharedProperties.length !== 0,

        alteredProperties: (): boolean => this._alteredProperties.length !== 0
    });

    public readonly count: Query<number> = Object.freeze({
        omittedKeys: (): number => this._omittedKeys.length,

        addedKeys: (): number => this._addedKeys.length,

        sharedProperties: (): number => this._sharedProperties.length,

        alteredProperties: (): number => this._alteredProperties.length
    });
}

export {isEqual} from "./util/isEqual";

export {Compare as default};
