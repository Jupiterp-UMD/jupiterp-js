/**
 * An abstract superclass for creating filters to be applied to API requests.
 * Currently useful for filtering courses by credits and instructors by rating.
 */
declare abstract class ApiFilter {
    columnName: string;
    filtersParams: string[];
    constructor(columnName: string);
    argsArray(): string[];
    equalTo(value: number): this;
    lessThanOrEqualTo(value: number): this;
    greaterThanOrEqualTo(value: number): this;
    lessThan(value: number): this;
    greaterThan(value: number): this;
    notEqualTo(value: number): this;
}
/**
 * A filter for the number of credits in a course. Can be used in a
 * `CoursesConfig`.
 * ```ts
 * const creditFilter =
 *  new CreditFilter().greaterThanOrEqualTo(2).lessThanOrEqualTo(4);
 * ```
 * This does not enforce that the filters make sense to be used together. For
 * instance, it is possible to create this:
 * ```ts
 * const creditFilter =
 *  new CreditFilter().equalTo(3).notEqualTo(3);
 * ```
 * which will never return any results.
 */
export declare class CreditFilter extends ApiFilter {
    constructor();
}
/**
 * A filter for the average rating of an instructor. Can be used in an `InstructorsConfig`.
 * ```ts
 * const ratingFilter = new RatingFilter().greaterThanOrEqualTo(4.0).lessThan(5.0);
 * ```
 * This does not enforce that the filters make sense to be used together. For
 * instance, it is possible to create this:
 * ```ts
 * const ratingFilter =
 *  new RatingFilter().equalTo(3).notEqualTo(3);
 * ```
 * which will never return any results.
 */
export declare class RatingFilter extends ApiFilter {
    constructor();
}
export {};
//# sourceMappingURL=api-filters.d.ts.map