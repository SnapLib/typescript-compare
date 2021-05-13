export class ObjectComparer<SourceType, TargetType>
{
    private readonly _srcObj: Readonly<SourceType>;
    private readonly _targetObj: Readonly<TargetType>;
    private readonly _omittedKeys: ReadonlyArray<string>;
    private readonly _addedKeys: ReadonlyArray<string>;
    private readonly _includedKeys: ReadonlyArray<string>;
    // private readonly _alteredKeyValues: readonly Readonly<{key: string, originalValue: Readonly<unknown>, newValue: Readonly<unknown>}>[];

    public constructor(sourceObject: SourceType, targetObject: TargetType)
    {
        this._srcObj = Object.freeze(sourceObject);
        this._targetObj = Object.freeze(targetObject);

        this._omittedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => ! (srcObjKey in targetObject)));

        this._addedKeys = Object.freeze(
            Object.keys(targetObject).filter(targetObjKey => ! Object.prototype.hasOwnProperty.call(sourceObject, targetObjKey)));

        this._includedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => srcObjKey in targetObject));
    }

    public readonly get = Object.freeze({
        sourceObject: (): Readonly<SourceType> => this._srcObj,

        targetObject: (): Readonly<TargetType> => this._targetObj,

        omittedKeys: (): ReadonlyArray<string> => this._omittedKeys,

        addedKeys: (): ReadonlyArray<string> => this._addedKeys,

        includedKeys: (): ReadonlyArray<string> => this._includedKeys
    });

    public readonly has = Object.freeze({
        omittedKeys: (): boolean => this._omittedKeys.length !== 0,

        addedKeys: (): boolean => this._addedKeys.length !== 0,

        includedKeys: (): boolean => this._includedKeys.length !== 0
    });

    public readonly count = Object.freeze({
        omittedKeys: (): number => this._omittedKeys.length,

        addedKeys: (): number => this._addedKeys.length,

        includedKeys: (): number => this._includedKeys.length
    });
}
