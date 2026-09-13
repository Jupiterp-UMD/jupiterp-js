/**
 * An abstract superclass for creating filters to be applied to API requests.
 * Currently useful for filtering courses by credits and instructors by rating. 
 */
abstract class ApiFilter {
    columnName: string;
    filtersParams: string[] = [];

    constructor(columnName: string) {
        this.columnName = columnName;
    }

    public argsArray(): string[] {
        return this.filtersParams;
    }

    public equalTo(value: number): this {
        this.filtersParams.push(`eq.${value}`);
        return this;
    }

    public lessThanOrEqualTo(value: number): this {
        this.filtersParams.push(`lte.${value}`);
        return this;
    }

    public greaterThanOrEqualTo(value: number): this {
        this.filtersParams.push(`gte.${value}`);
        return this;
    }

    public lessThan(value: number): this {
        this.filtersParams.push(`lt.${value}`);
        return this;
    }

    public greaterThan(value: number): this {
        this.filtersParams.push(`gt.${value}`);
        return this;
    }

    public notEqualTo(value: number): this {
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

export class TotalClassSizeFilter extends ApiFilter {
    constructor() {
        super("totalClassSize");
    }
}

/**
 * A filter for the average GPA of a course, section, or instructor grouping.
 * Can be used in a `GradesConfig` or `GradeSummaryConfig`.
 * ```ts
 * const gpaFilter = new GpaFilter().greaterThanOrEqualTo(3.5);
 * ```
 */
export class GpaFilter extends ApiFilter {
    constructor() {
        super("gpa");
    }
}

/**
 * A filter for the number of students who received a letter grade. Can be used
 * in a `GradesConfig`.
 *
 * Useful for excluding sections too small to read anything into: a three
 * student section with a 4.0 average is not a signal.
 * ```ts
 * const gradedFilter = new GradedFilter().greaterThanOrEqualTo(20);
 * ```
 */
export class GradedFilter extends ApiFilter {
    constructor() {
        super("graded");
    }
}

/**
 * A filter for the term a record belongs to, as a six-digit term code.
 * Can be used in a `GradesConfig` or `GradeSummaryConfig`.
 * ```ts
 * const termFilter = new TermFilter().greaterThanOrEqualTo(202008);
 * ```
 */
export class TermFilter extends ApiFilter {
    constructor() {
        super("term");
    }
}
