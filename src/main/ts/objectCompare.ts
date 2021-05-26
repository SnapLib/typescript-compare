import {ObjPropValueDiff} from "./util/objPropValueDiff";
import {evalPropValueDiffs} from "./util/evalPropValueDiffs";
import type {ObjectCompareHasQuery} from "./objCompareQueries/objectCompareHasQuery";
import type {ObjectCompareCountQuery} from "./objCompareQueries/objectCompareCountQuery";

export class ObjectCompare<SourceType, TargetType>
{
    private readonly _srcObj: Readonly<SourceType>;
    private readonly _targetObj: Readonly<TargetType>;
    private readonly _omittedKeys: ReadonlyArray<string>;
    private readonly _addedKeys: ReadonlyArray<string>;
    private readonly _sharedProperties: ReadonlyArray<string>;
    private readonly _alteredProperties: readonly Readonly<ObjPropValueDiff>[];
    private readonly _alteredPropValueKeys: ReadonlyArray<string>;

    public constructor(sourceObject: NonNullable<SourceType>, targetObject: NonNullable<TargetType>)
    {
        if (typeof sourceObject !== "object" || sourceObject === null || sourceObject === undefined)
        {
            throw new Error( ! sourceObject ? `${sourceObject} source object argument` : "source object argument not parsable to object");
        }

        if (typeof targetObject !== "object" || targetObject === null || targetObject === undefined)
        {
            throw new Error( ! targetObject ? `${targetObject} target object argument` : "target object argument not parsable to object");
        }

        this._srcObj = Object.freeze(sourceObject);
        this._targetObj = Object.freeze(targetObject);

        this._omittedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => ! (srcObjKey in targetObject)));

        this._addedKeys = Object.freeze(
            Object.keys(targetObject).filter(targetObjKey => ! Object.prototype.hasOwnProperty.call(sourceObject, targetObjKey)));

        this._alteredProperties =
            Object.freeze(evalPropValueDiffs(sourceObject, targetObject));

        this._alteredPropValueKeys =
            Object.freeze(this._alteredProperties.map(diff => diff.key));

        this._sharedProperties = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => srcObjKey in targetObject && ! this._alteredPropValueKeys.includes(srcObjKey)));

    }

    public get sourceObject(): Readonly<SourceType> { return this._srcObj; }
    public get targetObject(): Readonly<TargetType> { return this._targetObj; }
    public get omittedKeys(): ReadonlyArray<string> { return this._omittedKeys; }
    public get addedKeys(): ReadonlyArray<string> { return this._addedKeys; }
    public get sharedProperties(): ReadonlyArray<string> { return this._sharedProperties; }
    public get alteredProperties(): readonly Readonly<ObjPropValueDiff>[] { return this._alteredProperties; }
    public get alteredPropValueKeys(): ReadonlyArray<string> { return this._alteredPropValueKeys; }

    public readonly has: ObjectCompareHasQuery = Object.freeze({
        omittedKeys: (): boolean => this._omittedKeys.length !== 0,

        addedKeys: (): boolean => this._addedKeys.length !== 0,

        includedKeys: (): boolean => this._sharedProperties.length !== 0,

        alteredPropValues: (): boolean => this._alteredProperties.length !== 0
    });

    public readonly count: ObjectCompareCountQuery = Object.freeze({
        omittedKeys: (): number => this._omittedKeys.length,

        addedKeys: (): number => this._addedKeys.length,

        includedKeys: (): number => this._sharedProperties.length,

        alteredPropValues: (): number => this._alteredProperties.length
    });
}

export {isEqual} from "./util/isEqual";

export {ObjectCompare as default};
