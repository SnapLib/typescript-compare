export class ObjPropValueDiff<SourceValueType, TargetValueType>
{
    private readonly _key: string;
    private readonly _sourceValue: Readonly<SourceValueType>;
    private readonly _targetValue: Readonly<TargetValueType>;

    public readonly 0: string;
    public readonly 1: Readonly<SourceValueType>;
    public readonly 2: Readonly<TargetValueType>;

    public constructor(key: string, sourceValue: SourceValueType, targetValue: TargetValueType)
    {
        this._key = Object.freeze(key);
        this[0] = Object.freeze(key);
        this._sourceValue = Object.freeze(sourceValue);
        this[1] = Object.freeze(sourceValue);
        this._targetValue = Object.freeze(targetValue);
        this[2] = Object.freeze(targetValue);
    }

    public get key(): string { return this._key; }
    public get sourceValue(): Readonly<SourceValueType> { return this._sourceValue; }
    public get targetValue(): Readonly<TargetValueType> { return this._targetValue; }
}

export {ObjPropValueDiff as default};
