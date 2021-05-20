export interface ObjectComparerCountQuery
{
    readonly omittedKeys: () => number;
    readonly addedKeys: () => number;
    readonly includedKeys: () => number;
    readonly alteredKeyValues: () => number;
}

export type {ObjectComparerCountQuery as default};
