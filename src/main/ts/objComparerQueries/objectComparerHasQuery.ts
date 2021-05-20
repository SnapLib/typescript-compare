export interface ObjectComparerHasQuery
{
    readonly omittedKeys: () => boolean;
    readonly addedKeys: () => boolean;
    readonly includedKeys: () => boolean;
    readonly alteredKeyValues: () => boolean;
}

export type {ObjectComparerHasQuery as default};
