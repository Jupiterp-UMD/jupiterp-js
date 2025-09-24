import { CreditFilter, RatingFilter } from "./api-filters.js";
import { GenEd } from "../common/course-traits.js";
import { SortBy } from "./sort-by.js";

/**
 * Configuration for a request to any of the courses endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `genEds?: Set<GenEd>`
 * - `creditFilters?: CreditFilter`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface CoursesConfig {
    /**
     * A set of course codes to get results for. Course codes are the
     * department code followed by the course number, e.g. "CMSC131".
     * Cannot set both courseCodes and prefix.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all courses with a course code starting with "CMSC".
     * Cannot set both courseCodes and prefix.
     */
    prefix?: string;

    /**
     * A set of gen eds to filter courses by. If multiple GenEds are provided,
     * the results will be courses that require *all* of the provided GenEds.
     */
    genEds?: Set<GenEd>;

    /**
     * Equalities and inequalities to filter courses by their number of credits.
     */
    creditFilters?: CreditFilter;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}

export function coursesConfigToQueryParams(cfg: CoursesConfig): URLSearchParams {
    const params = new URLSearchParams();
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.genEds && cfg.genEds.size > 0) {
        params.append("genEds", Array.from(cfg.genEds).join(","));
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.creditFilters) {
        for (const arg of cfg.creditFilters.argsArray()) {
            params.append("creditFilters", arg);
        }
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}

/**
 * Configuration for a request to sections endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface SectionsConfig {
    /**
     * A set of course codes to get results for. Cannot set both
     * courseCodes and prefix.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all sections with a course code starting with "CMSC".
     * Cannot set both courseCodes and prefix.
     */
    prefix?: string;

    /**
     * Maximum number of section records to return; defaults to 100, 
     * maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}

export function sectionsConfigToQueryParams(cfg: SectionsConfig): URLSearchParams {
    const params = new URLSearchParams();
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}

/**
 * Configuration for a request to instructors endpoints.
 * 
 * Fields:
 * - `instructorNames?: Set<string>`
 * - `instructorSlugs?: Set<string>`
 * - `ratings?: RatingFilter`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface InstructorsConfig {
    /**
     * A set of instructor names to get results for. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorNames?: Set<string>;

    /**
     * A set of instructor slugs to get results for. Slugs are the internal
     * identifier used to distinguish an instructor and are unique to each
     * instructor. See PlanetTerp API spec for more info. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorSlugs?: Set<string>;

    /**
     * Equalities and inequalities to filter instructors by their average
     * rating on PlanetTerp.
     */
    ratings?: RatingFilter;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}

export function instructorsConfigToQueryParams(cfg: InstructorsConfig): URLSearchParams {
    const params = new URLSearchParams();
    if (cfg.instructorNames && cfg.instructorNames.size > 0) {
        params.append("instructorNames", Array.from(cfg.instructorNames).join(","));
    }
    if (cfg.instructorSlugs && cfg.instructorSlugs.size > 0) {
        params.append("instructorSlugs", Array.from(cfg.instructorSlugs).join(","));
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.ratings) {
        for (const arg of cfg.ratings.argsArray()) {
            params.append("ratings", arg);
        }
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}