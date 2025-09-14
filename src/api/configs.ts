import { CreditFilter, RatingFilter } from "./api-filters";
import { GenEd } from "../common/course-traits";
import { SortBy } from "./sort-by";

/**
 * Configuration for a request to any of the courses endpoints.
 */
export interface CoursesConfig {
    /**
     * A set of course codes to get results for. Course codes are the
     * department code followed by the course number, e.g. "CMSC131".
     * Cannot set both courseCodes and prefix.
     */
    courseCodes: Set<string> | null;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all courses with a course code starting with "CMSC".
     * Cannot set both courseCodes and prefix.
     */
    prefix: string | null;

    /**
     * A set of gen eds to filter courses by. If multiple GenEds are provided,
     * the results will be courses that require *all* of the provided GenEds.
     */
    genEds: Set<GenEd> | null;

    /**
     * Equalities and inequalities to filter courses by their number of credits.
     */
    creditFilters: CreditFilter | null;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit: number | null;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset: number | null;

    /**
     * Columns to sort by when returning.
     */
    sortBy: SortBy | null;
}

/**
 * Configuration for a request to sections endpoints.
 */
export interface SectionsConfig {
    /**
     * A set of course codes to get results for. Cannot set both
     * courseCodes and prefix.
     */
    courseCodes: Set<string> | null;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all sections with a course code starting with "CMSC".
     * Cannot set both courseCodes and prefix.
     */
    prefix: string | null;

    /**
     * Maximum number of section records to return; defaults to 100, 
     * maximum of 500.
     */
    limit: number | null;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset: number | null;

    /**
     * Columns to sort by when returning.
     */
    sortBy: SortBy | null;
}

export function sectionConfigToQueryParams(cfg: SectionsConfig): URLSearchParams {
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
 */
export interface InstructorConfig {
    /**
     * A set of instructor names to get results for. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorNames: Set<string> | null;

    /**
     * A set of instructor slugs to get results for. Slugs are the internal
     * identifier used to distinguish an instructor and are unique to each
     * instructor. See PlanetTerp API spec for more info. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorSlugs: Set<string> | null;

    /**
     * Equalities and inequalities to filter instructors by their average
     * rating on PlanetTerp.
     */
    ratings: RatingFilter | null;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit: number | null;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset: number | null;

    /**
     * Columns to sort by when returning.
     */
    sortBy: SortBy | null;
}

export function instructorConfigToQueryParams(cfg: InstructorConfig): URLSearchParams {
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