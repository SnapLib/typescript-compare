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
     *
     * @returns {number | boolean} Either a number indicating how many
     *          omitted keys the target object does not contain or a boolean
     *          indicating whether or not any omitted keys are present.
     */
    readonly omittedKeys: () => QueryReturnType;

    /**
     * Query to check either the number or existence of added property keys
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a number indicating how many
     *          added keys the target object contains that aren't present in the
     *          source object or a boolean indicating whether or not any added
     *          keys are present in the target object.
     */
    readonly addedKeys: () => QueryReturnType;

    /**
     * Query to check either the number or existence of shared properties
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a number indicating how many identical
     *          properties the source and target object contain or a boolean
     *          indicating whether or not any shared properties are present.
     */
    readonly sharedProperties: () => QueryReturnType;

    /**
     * Query to check either the number or existence of altered properties
     * between the source and target object being compared.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a number indicating how many
     *          properties the source and target object contain with differing
     *          values but same keys or a boolean indicating whether or not any
     *          altered properties are present.
     */
    readonly alteredProperties: () => QueryReturnType;
}

export type {ObjectCompareQuery as default};
