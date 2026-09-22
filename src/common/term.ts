/**
 * The term that course and section data is from, as returned by `term`.
 *
 * Course and section data covers one term at a time. This says which, so a
 * consumer can label it or link to Testudo without hardcoding a term code.
 */
export interface CatalogTerm {
    /**
     * Six-digit term code: the year followed by the month the term begins,
     * so `202608` is Fall 2026 and `202701` is Spring 2027.
     */
    term: number,

    /** When a scrape last confirmed the term, as an ISO 8601 timestamp. */
    updated_at: string,
}
