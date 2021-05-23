import {ObjPropValueDiff} from "./util/objPropValueDiff";
import {evalPropValueDiffs} from "./util/evalPropValueDiffs";
import type {ObjectCompareHasQuery} from "./objComparerQueries/objectCompareHasQuery";
import type {ObjectCompareCountQuery} from "./objComparerQueries/objectCompareCountQuery";

export class ObjectCompare<SourceType, TargetType>
{
    private readonly _srcObj: Readonly<SourceType>;
    private readonly _targetObj: Readonly<TargetType>;
    private readonly _omittedKeys: ReadonlyArray<string>;
    private readonly _addedKeys: ReadonlyArray<string>;
    private readonly _includedKeys: ReadonlyArray<string>;
    private readonly _alteredPropValueDiffs: readonly Readonly<ObjPropValueDiff>[];
    private readonly _alteredKeyValueKeys: ReadonlyArray<string>;

    public constructor(sourceObject: NonNullable<SourceType>, targetObject: NonNullable<TargetType>)
    {
        this._srcObj = Object.freeze(sourceObject);
        this._targetObj = Object.freeze(targetObject);

        this._omittedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => ! (srcObjKey in targetObject)));

        this._addedKeys = Object.freeze(
            Object.keys(targetObject).filter(targetObjKey => ! Object.prototype.hasOwnProperty.call(sourceObject, targetObjKey)));

        this._includedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => srcObjKey in targetObject));

        this._alteredPropValueDiffs =
            Object.freeze(evalPropValueDiffs(sourceObject, targetObject));

        this._alteredKeyValueKeys =
            Object.freeze(this._alteredPropValueDiffs.map(diff => diff.key));
    }

    public get sourceObject(): Readonly<SourceType> { return this._srcObj; }
    public get targetObject(): Readonly<TargetType> { return this._targetObj; }
    public get omittedKeys(): ReadonlyArray<string> { return this._omittedKeys; }
    public get addedKeys(): ReadonlyArray<string> { return this._addedKeys; }
    public get includedKeys(): ReadonlyArray<string> { return this._includedKeys; }
    public get alteredPropValueDiffs(): readonly Readonly<ObjPropValueDiff>[] { return this._alteredPropValueDiffs; }
    public get alteredKeyValueKeys(): ReadonlyArray<string> { return this._alteredKeyValueKeys; }

    public readonly has: ObjectCompareHasQuery = Object.freeze({
        omittedKeys: (): boolean => this._omittedKeys.length !== 0,

        addedKeys: (): boolean => this._addedKeys.length !== 0,

        includedKeys: (): boolean => this._includedKeys.length !== 0,

        alteredPropValues: (): boolean => this._alteredPropValueDiffs.length !== 0
    });

    public readonly count: ObjectCompareCountQuery = Object.freeze({
        omittedKeys: (): number => this._omittedKeys.length,

        addedKeys: (): number => this._addedKeys.length,

        includedKeys: (): number => this._includedKeys.length,

        alteredPropValues: (): number => this._alteredPropValueDiffs.length
    });
}
