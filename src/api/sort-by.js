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
export class SortBy {
    constructor() {
        this.sortKeys = [];
    }
    ascending(key) {
        this.sortKeys.push(`${key}.asc`);
        return this;
    }
    descending(key) {
        this.sortKeys.push(`${key}.desc`);
        return this;
    }
    argsArray() {
        return this.sortKeys;
    }
    length() {
        return this.sortKeys.length;
    }
}
