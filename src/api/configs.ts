import { CreditFilter } from "./api-filters";
import { GenEd } from "../common/course-traits";
import { SortBy } from "./sort-by";

/**
 * Configuration for a request to any of the courses endpoints.
 */
export class CoursesConfig {
    courseCodes: Set<string> | null = null;
    prefix: string | null = null;
    genEds: Set<GenEd> | null = null;
    creditFilters: Set<CreditFilter> | null = null;
    limit: number | null = null;
    offset: number | null = null;
    sortBy: SortBy | null = null;
}