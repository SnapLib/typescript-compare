export class PropertyDifference
{
    /**
     * The key that the differing source and target property values are
     * mapped to.
     *
     * @private
     * @readonly
     */
    private readonly _key: string;

    /**
     * The value the property key is mapped to in the source object.
     *
     * @private
     * @readonly
     */
    private readonly _sourceValue: Readonly<unknown>;

    /**
     * The value the property key is mapped to in the target object.
     *
     * @private
     * @readonly
     */
    private readonly _targetValue: Readonly<unknown>;

    /**
     * Index access to the key that the differing source and target property
     * values are mapped to.
     *
     * @pubic
     * @readonly
     */
    public readonly 0: string;

    /**
     * Index access to the value the property key is mapped to in the source
     * object.
     *
     * @pubic
     * @readonly
     */
    public readonly 1: Readonly<unknown>;

    /**
     * Index access to the value the property key is mapped to in the target
     * object.
     *
     * @pubic
     * @readonly
     */
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

    /**
     * Returns the key that the differing source and target property values are
     * mapped to.
     *
     * @public
     * @returns {string} The key that the differing source and target property
     *                   values are mapped to.
     */
    public get key(): string { return this._key; }

    /**
     * Returns the value the property key is mapped to in the source object.
     *
     * @public
     * @returns {Readonly<object>} The value the property key is mapped to in
     *                             the source object.
     */
    public get sourceValue(): Readonly<unknown> { return this._sourceValue; }

    /**
     * Returns the value the property key is mapped to in the target object.
     *
     * @public
     * @returns {Readonly<object>} The value the property key is mapped to in
     *                             the target object.
     */
    public get targetValue(): Readonly<unknown> { return this._targetValue; }

    /**
     * Returns a string representation of this object that conveys the key,
     * source, and target value of the differing property.
     *
     * @public
     * @returns {string} A string representation of this object that conveys the
     *                   key, source, and target value of the differing property.
     */
    public toString(): string
    {
        return `{key: "${this._key}", sourceValue: ${toStr(this._sourceValue)}, targetValue: ${toStr(this._targetValue)}}`;
    }
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
