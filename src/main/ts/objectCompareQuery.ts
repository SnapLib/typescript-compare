/**
 * The return type returned by {@link ObjectCompare.count} and
 * {@link ObjectCompare.has}.
 *
 * This interface defines the return type when querying {@link ObjectCompare}
 * objects for the number or existence of `omittedKeys`, `addedKeys`,
 * `sharedProperties`, or `alteredProperties`. When querying for the *count*,
 * this interface's properties are based on numbers, when querying for the
 * existence this interface's properties are based on boolean values.
 *
 * @interface
 */
export interface ObjectCompareQuery<QueryReturnType extends number | boolean>
{
    /**
     * Query to check either the number or existence of omitted property keys
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     */
    readonly omittedKeys: () => QueryReturnType;

    /**
     * Query to check either the number or existence of added property keys
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     */
    readonly addedKeys: () => QueryReturnType;

    /**
     * Query to check either the number or existence of shared properties
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     */
    readonly sharedProperties: () => QueryReturnType;

    /**
     * Query to check either the number or existence of altered properties
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     */
    readonly alteredProperties: () => QueryReturnType;
}

export type {ObjectCompareQuery as default};
