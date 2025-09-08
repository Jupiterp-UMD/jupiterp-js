/**
 * Class to build sortBy query parameters for API requests.
 * Sorting is done in the order that the keys are added.
 * ```ts
 * const sortBy =
 *   new SortBy()
 *     .ascending("name")
 *     .descending("min_credits");
 * console.log(sortBy.stringify()); // "sortBy=name.asc,min_credits.desc"
 * ```
 */
export class SortBy {
    sortKeys: string[] = [];

    constructor() {}

    public ascending(key: string): this {
        this.sortKeys.push(`${key}.asc`);
        return this;
    }

    public descending(key: string): this {
        this.sortKeys.push(`${key}.desc`);
        return this;
    }

    public stringify(): string {
        return `sortBy=${this.sortKeys.join(",")}`;
    }
}