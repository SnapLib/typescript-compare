export class ObjPropValueDiff
{
    private readonly _key: string;
    private readonly _sourceValue: unknown;
    private readonly _targetValue: unknown;

    public readonly 0: string;
    public readonly 1: unknown;
    public readonly 2: unknown;

    public constructor(key: string, sourceValue: unknown, targetValue: unknown)
    {
        this._key = key;
        this[0] = key;
        this._sourceValue = sourceValue;
        this[1] = sourceValue;
        this._targetValue = targetValue;
        this[2] = targetValue;
    }

    public get key(): string { return this._key; }
    public get sourceValue(): unknown { return this._sourceValue; }
    public get targetValue(): unknown { return this._targetValue; }
}

export {ObjPropValueDiff as default};
