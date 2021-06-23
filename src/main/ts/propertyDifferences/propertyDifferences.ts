export type PropertyDifferences =
{
    readonly [sharedPropKey: string]: {sourceValue: Readonly<unknown>, targetValue: Readonly<unknown>}
};

export type {PropertyDifferences as default};
