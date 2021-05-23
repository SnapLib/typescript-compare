export interface ObjectCompareHasQuery
{
    readonly omittedKeys: () => boolean;
    readonly addedKeys: () => boolean;
    readonly includedKeys: () => boolean;
    readonly alteredPropValues: () => boolean;
}

export type {ObjectCompareHasQuery as default};
