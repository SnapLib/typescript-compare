/**
 * This module contains the interface responsible for defining the
 * {@link Compare.count `count`} and {@link Compare.has `has`} queries of the
 * {@link Compare} class.
 *
 * @module query
 * @author Snap
 */

/**
 * The return type returned by {@link Compare.count} and
 * {@link Compare.has}.
 *
 * This interface defines the return type when querying {@link Compare}
 * objects for the number or existence of
 * {@link Compare.omittedProperties `omittedProperties`},
 * {@link Compare.extraProperties `extraProperties`},
 * {@link Compare.sharedProperties `sharedProperties`}, and
 * {@link Compare.alteredProperties `alteredProperties`}. When querying
 * for the {@link Compare.count `count`}, this interface's properties are based
 * on `number`s, when querying for the {@link Compare.has `has`} (the existence)
 * this interface's properties are based on `boolean` values.
 *
 * @template {number | boolean} QueryReturnType - The type each query returns
 *           dependent on whether it's a query for the
 *           {@link Compare.count count} or {@link Compare.has has} (existence)
 *
 * @interface
 * @author Snap
 */
export interface Query<QueryReturnType extends number | boolean>
{
    /**
     * Returns either a `boolean` indicating if there are properties in the
     * source object that aren't in the target object it's being compared to or
     * the `number` of properties the source object contains that the target
     * object does not.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a `boolean` indicating if there are
     *          properties in the source object that aren't in the target object
     *          or the `number` of properties the source object contains that
     *          the target object does not.
     */
    readonly omittedProperties: () => QueryReturnType;

    /**
     * Returns either a `boolean` indicating if there are properties in the
     * target object that aren't in the source object being compared to it or
     * the `number` of properties the target object contains that the source
     * object does not.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a `boolean` indicating if there are
     *          properties in the target object that aren't in the source object
     *          or the `number` of properties the target object contains that
     *          the source object does not.
     */
    readonly extraProperties: () => QueryReturnType;

    /**
     * Returns either a `boolean` indicating if there are equivalent properties
     * in both the source object and target object it's being compared to or the
     * `number` of equivalent properties both the source and target object
     * contain.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a `boolean` indicating if there are
     *          equivalent properties in both the source object and target or
     *          the `number` of equivalent properties in both the source and
     *          target objects.
     */
    readonly sharedProperties: () => QueryReturnType;

    /**
     * Returns either a `boolean` indicating if there are any equivalent
     * property keys in both the source object and target object it's being
     * compared to that are mapped to differing values or the `number` of
     * equivalent property keys in both the source object and target object that
     * are mapped to differing values.
     *
     * @public
     * @readonly
     * @abstract
     *
     * @returns {number | boolean} Either a `boolean` indicating if there are
     *          any equivalent property keys in both the source and target
     *          object that are mapped to differing values or the `number` of
     *          equivalent property keys in both the source and target object
     *          that are mapped to differing values.
     */
    readonly alteredProperties: () => QueryReturnType;
}

export type {Query as default};
