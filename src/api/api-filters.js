/**
 * An abstract superclass for creating filters to be applied to API requests.
 * Currently useful for filtering courses by credits and instructors by rating.
 */
class ApiFilter {
    constructor(columnName) {
        this.filtersParams = [];
        this.columnName = columnName;
    }
    argsArray() {
        return this.filtersParams;
    }
    equalTo(value) {
        this.filtersParams.push(`eq.${value}`);
        return this;
    }
    lessThanOrEqualTo(value) {
        this.filtersParams.push(`lte.${value}`);
        return this;
    }
    greaterThanOrEqualTo(value) {
        this.filtersParams.push(`gte.${value}`);
        return this;
    }
    lessThan(value) {
        this.filtersParams.push(`lt.${value}`);
        return this;
    }
    greaterThan(value) {
        this.filtersParams.push(`gt.${value}`);
        return this;
    }
    notEqualTo(value) {
        this.filtersParams.push(`neq.${value}`);
        return this;
    }
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
export class CreditFilter extends ApiFilter {
    constructor() {
        super("credits");
    }
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
export class RatingFilter extends ApiFilter {
    constructor() {
        super("ratings");
    }
}
