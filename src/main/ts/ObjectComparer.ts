export class ObjectComparer<SourceType, TargetType>
{
    private readonly _srcObj: Readonly<SourceType>;
    private readonly _targetObj: Readonly<TargetType>;
    private readonly _omittedKeys: ReadonlyArray<string>;
    private readonly _addedKeys: ReadonlyArray<string>;
    private readonly _includedKeys: ReadonlyArray<string>;
    private readonly _alteredKeyValues: readonly Readonly<{key: string, originalValue: Readonly<unknown>, newValue: Readonly<unknown>}>[];

    public constructor(sourceObject: SourceType, targetObject: TargetType)
    {
        this._srcObj = Object.freeze(sourceObject);
        this._targetObj = Object.freeze(targetObject);

        const srcObjEntries: readonly Readonly<[string, unknown]>[] =
            Object.freeze(Object.entries(sourceObject));

        const targetObjEntries: readonly Readonly<[string, unknown]>[] =
            Object.freeze(Object.entries(targetObject));

        const srcObjKeys: ReadonlyArray<string> =
            Object.freeze(Object.keys(sourceObject));

        const targetObjKeys: ReadonlyArray<string> =
            Object.freeze(Object.keys(targetObject));

        this._omittedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => ! (srcObjKey in targetObject)));

        this._addedKeys = Object.freeze(
            Object.keys(targetObject).filter(targetObjKey => ! Object.prototype.hasOwnProperty.call(sourceObject, targetObjKey)));

        this._includedKeys = Object.freeze(
            Object.keys(sourceObject).filter(srcObjKey => srcObjKey in targetObject));

        this._alteredKeyValues = Object.freeze(
            srcObjEntries.filter(srcObjEntry =>
                targetObjEntries.some(targetObjEntry => srcObjEntry[0] === targetObjEntry[0] && srcObjEntry[1] !== targetObjEntry[1]))
                .map(srcObjEntry => (Object.freeze({
                    key: srcObjEntry[0],
                    originalValue: Object.freeze(srcObjEntry[1]),
                    newValue: Object.freeze(targetObjEntries.filter(e => e[0] === srcObjEntry[0])[0][1])}))));
    }

    public readonly get = Object.freeze({
        sourceObject: (): Readonly<SourceType> => this._srcObj,

        targetObject: (): Readonly<TargetType> => this._targetObj,

        omittedKeys: (): ReadonlyArray<string> => this._omittedKeys,

        addedKeys: (): ReadonlyArray<string> => this._addedKeys,

        includedKeys: (): ReadonlyArray<string> => this._includedKeys,

        alteredKeyValues: (): readonly Readonly<{key: string, originalValue: Readonly<unknown>, newValue: Readonly<unknown>}>[] => this._alteredKeyValues
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
