export interface ObjectCompareCountQuery
{
    readonly omittedKeys: () => number;
    readonly addedKeys: () => number;
    readonly includedKeys: () => number;
    readonly alteredPropValues: () => number;
}

export type {ObjectCompareCountQuery as default};
