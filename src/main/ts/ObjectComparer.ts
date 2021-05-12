export class ObjectComparer
{
    /**
     * The object being compared to the target object.
     *
     * @private
     * @readonly
     */
    private readonly _sourceObject: Readonly<{[key: string]: unknown}>;

    /**
     * The object being compared to the source object.
     *
     * @private
     * @readonly
     */
    private readonly _targetObject: Readonly<{[key: string]: unknown}>;

    /**
     * Array of keys that are present in the source object, but not in the
     * target object.
     *
     * @private
     * @readonly
     */
    private readonly _omittedKeys: ReadonlyArray<string>;

    /**
     * Array of keys that are present in both the source and target object.
     *
     * @private
     * @readonly
     */
    private readonly _includedKeys: ReadonlyArray<string>;

    /**
     * Array of entries whose keys are present in both the source and target
     * object, but are mapped to differing values. The key, original value from
     * the source object, and differing value from the target object are
     * returned.
     *
     * @private
     * @readonly
     */
    private readonly _alteredKeyValues: readonly Readonly<{key: string, originalValue: Readonly<unknown>, newValue: Readonly<unknown>}>[];

    public constructor(sourceObject: Readonly<{[key: string]: unknown}>, targetObject: Readonly<{[key: string]: unknown}>)
    {
        this._sourceObject = Object.freeze(sourceObject);
        this._targetObject = Object.freeze(targetObject);

        const sourceObjectKeys: ReadonlyArray<string> =
            Object.freeze(Object.keys(sourceObject));

        this._omittedKeys = Object.freeze(
            sourceObjectKeys.filter(key => ! (key in targetObject)));

        this._includedKeys = Object.freeze(
            sourceObjectKeys.filter(key => key in targetObject));

        this._alteredKeyValues = Object.freeze(Object.entries(targetObject)
           .filter(entry => entry[0] in sourceObject && sourceObject[entry[0]] !== entry[1])
           .map(mutatedEntry => (
               Object.freeze({
                   key: mutatedEntry[0],
                   originalValue: Object.freeze(sourceObject[mutatedEntry[0]]),
                   newValue: Object.freeze(mutatedEntry[1])}))));
    }

    public readonly get = Object.freeze({
        sourceObject: (): Readonly<unknown> =>
        {
            return this._sourceObject;
        },

        targetObject: (): Readonly<unknown> =>
        {
            return this._targetObject;
        },

        omittedKeys: (): ReadonlyArray<string> =>
        {
            return this._omittedKeys;
        },

        includedKeys: (): ReadonlyArray<string> =>
        {
            return this._includedKeys;
        },

        alteredKeyValues: (): readonly Readonly<{key: string, originalValue: Readonly<unknown>, newValue: Readonly<unknown>}>[] =>
        {
            return this._alteredKeyValues;
        }
    });

    public readonly has = Object.freeze({
        omittedKeys: (): boolean =>
        {
            return this._omittedKeys.length !== 0;
        },

        includedKeys: (): boolean =>
        {
            return this._includedKeys.length !== 0;
        },

        alteredKeyValues: (): boolean =>
        {
            return this._alteredKeyValues.length !== 0;
        }
    });

    public readonly count = Object.freeze({
        omittedKeys: (): number =>
        {
            return this._omittedKeys.length;
        },

        includedKeys: (): number =>
        {
            return this._includedKeys.length;
        },

        alteredKeyValues: (): number =>
        {
            return this._alteredKeyValues.length;
        }
    });
}

export {ObjectComparer as default};
