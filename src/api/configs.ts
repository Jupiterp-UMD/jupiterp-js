import { CreditFilter } from "./api-filters";
import { GenEd } from "../common/course-traits";
import { SortBy } from "./sort-by";

/**
 * Configuration for a request to any of the courses endpoints.
 */
export interface CourseConfig {
    courseCodes: Set<string> | null;
    prefix: string | null;
    genEds: Set<GenEd> | null;
    creditFilters: CreditFilter | null;
    limit: number | null;
    offset: number | null;
    sortBy: SortBy | null;
}