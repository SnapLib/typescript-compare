export interface ObjectComparerCountQuery
{
    readonly omittedKeys: () => number;
    readonly addedKeys: () => number;
    readonly includedKeys: () => number;
    readonly alteredPropValues: () => number;
}

export type {ObjectComparerCountQuery as default};
