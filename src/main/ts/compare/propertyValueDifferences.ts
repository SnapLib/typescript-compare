/**
 * @module propertyValueDifferences
 */

export interface PropertyValueDifferences
{
    readonly [propertyKey: string]: { readonly sourceValue: Readonly<unknown>,
                                      readonly targetValue: Readonly<unknown> };
}

export {getPropertyValueDifferences} from "./propertyValueDifferences/getPropertyValueDifferences";

export type {PropertyValueDifferences as default};
