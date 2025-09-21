/**
 * Class to build sortBy query parameters for API requests.
 * Sorting is done in the order that the keys are added.
 * ```ts
 * const sortBy =
 *   new SortBy()
 *     .ascending("name")
 *     .descending("min_credits");
 * ```
 */
export declare class SortBy {
    sortKeys: string[];
    constructor();
    ascending(key: string): this;
    descending(key: string): this;
    argsArray(): string[];
    length(): number;
}
//# sourceMappingURL=sort-by.d.ts.map