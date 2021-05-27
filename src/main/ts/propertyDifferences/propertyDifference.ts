export class PropertyDifference
{
    private readonly _key: string;
    private readonly _sourceValue: Readonly<unknown>;
    private readonly _targetValue: Readonly<unknown>;

    public readonly 0: string;
    public readonly 1: Readonly<unknown>;
    public readonly 2: Readonly<unknown>;

    public constructor(key: string, sourceValue: unknown, targetValue: unknown)
    {
        this._key = Object.freeze(key);
        this[0] = Object.freeze(key);
        this._sourceValue = Object.freeze(sourceValue);
        this[1] = Object.freeze(sourceValue);
        this._targetValue = Object.freeze(targetValue);
        this[2] = Object.freeze(targetValue);
    }

    public get key(): string { return this._key; }
    public get sourceValue(): Readonly<unknown> { return this._sourceValue; }
    public get targetValue(): Readonly<unknown> { return this._targetValue; }
    public toString(): string { return `{key: "${this._key}", sourceValue: ${toStr(this._sourceValue)}, targetValue: ${toStr(this._targetValue)}`; }
}

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : typeof o === "symbol" ? `Symbol("${o.description}")`
           : typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

export {PropertyDifference as default};
