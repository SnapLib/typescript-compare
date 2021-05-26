export interface ObjectCompareQuery<QueryReturnType extends number | boolean>
{
    readonly omittedKeys: () => QueryReturnType;
    readonly addedKeys: () => QueryReturnType;
    readonly sharedProperties: () => QueryReturnType;
    readonly alteredProperties: () => QueryReturnType;
}

export type {ObjectCompareQuery as default};
