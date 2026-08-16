import {
    CreditFilter,
    GpaFilter,
    GradedFilter,
    RatingFilter,
    TermFilter,
} from "./api-filters.js";
import type { GradeGroupBy } from "../common/grades.js";
import { GenEd } from "../common/gen-eds.js";
import { SortBy } from "./sort-by.js";

/**
 * Configuration for a request to any of the courses endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `number?: string`
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
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all courses with a course code starting with "CMSC".
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    prefix?: string;

    /**
     * A specific course number to filter courses by. For instance, setting
     * this to "131" will return all courses with a course number of 131,
     * regardless of department.
     * 
     * Note: This is different from the `prefix` field, which filters by
     * department code.
     * 
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    number?: string;

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
    if (cfg.number) {
        params.append("number", cfg.number);
    }
    if (cfg.genEds && cfg.genEds.size > 0) {
        params.append("genEds", Array.from(cfg.genEds).map(ge => ge.code).join(","));
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.creditFilters) {
        for (const arg of cfg.creditFilters.argsArray()) {
            params.append("credits", arg);
        }
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}

/**
 * Configuration for a request to courses-with-sections endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `number?: string`
 * - `genEds?: Set<GenEd>`
 * - `creditFilters?: CreditFilter`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface CoursesWithSectionsConfig extends CoursesConfig {
    /**
     * Filter sections by total class size (capacity).
     */
    totalClassSize?: number;

    /**
     * If true, only return sections with more then 0 open seats.
     */
    onlyOpen?: boolean;

    /**
     * Only return sections taught by this instructor (full name, case-sensitive).
     */
    instructor?: string;
}

export function coursesWithSectionsConfigToQueryParams(
                cfg: CoursesWithSectionsConfig): URLSearchParams {
    const params = coursesConfigToQueryParams(cfg);
    if (cfg.totalClassSize !== null && cfg.totalClassSize !== undefined) {
        params.append("totalClassSize", cfg.totalClassSize.toString());
    }
    if (cfg.onlyOpen !== null && cfg.onlyOpen !== undefined) {
        params.append("onlyOpen", cfg.onlyOpen.toString());
    }
    if (cfg.instructor) {
        params.append("instructor", cfg.instructor);
    }
    return params;
}

/**
 * Configuration for a request to sections endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `totalClassSize?: number`
 * - `onlyOpen?: boolean`
 * - `instructor?: string`
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
     * Filter sections by total class size (capacity).
     */
    totalClassSize?: number;

    /**
     * If true, only return sections with more then 0 open seats.
     */
    onlyOpen?: boolean;

    /**
     * Only return sections taught by this instructor (full name, case-sensitive).
     */
    instructor?: string;

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
    if (cfg.totalClassSize !== null && cfg.totalClassSize !== undefined) {
        params.append("totalClassSize", cfg.totalClassSize.toString());
    }
    if (cfg.onlyOpen !== null && cfg.onlyOpen !== undefined) {
        params.append("onlyOpen", cfg.onlyOpen.toString());
    }
    if (cfg.instructor) {
        params.append("instructor", cfg.instructor);
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
     * A set of instructor slugs to get results for. Slugs are the identifier
     * used in professor page URLs and are unique to each instructor. Cannot
     * set both instructorNames and instructorSlugs.
     *
     * **Slug format changed in v1.0.0.** These are now Jupiterp's own slugs
     * (`daniel-abadi`), not PlanetTerp's (`abadi_daniel`). Slugs stored by an
     * earlier version of this library will not match anything.
     */
    instructorSlugs?: Set<string>;

    /**
     * A partial name to search for, matched case-insensitively anywhere in the
     * instructor's name.
     *
     * Accents and punctuation are ignored on both sides, so "obrien" finds
     * "O'Brien" and "jose" finds "José". This is the way to find an instructor
     * by partial name; the alternative is downloading every instructor and
     * filtering client-side, which does not scale.
     */
    nameSearch?: string;

    /**
     * If true, return only instructors teaching at least one section in the
     * current term.
     */
    activeOnly?: boolean;

    /**
     * If true, the total number of matching instructors is returned in
     * `ApiResponse.total`, regardless of how many this page contains.
     *
     * Costs an extra aggregate over the filtered set on the server, so it is
     * off by default. Set it when you need to render "1-50 of 4,812" or know
     * how many pages exist.
     */
    count?: boolean;

    /**
     * Equalities and inequalities to filter instructors by their rating.
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
    if (cfg.nameSearch) {
        params.append("nameSearch", cfg.nameSearch);
    }
    if (cfg.activeOnly) {
        params.append("activeOnly", "true");
    }
    if (cfg.count) {
        params.append("count", "true");
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
/**
 * Configuration for a request to `/v0/grades`, which returns one record per
 * section.
 *
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `number?: string`
 * - `instructorSlug?: string`
 * - `instructorId?: number`
 * - `terms?: TermFilter`
 * - `gpa?: GpaFilter`
 * - `graded?: GradedFilter`
 * - `instructorSources?: Set<string>`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface GradesConfig {
    /**
     * A set of course codes to get results for. Cannot set more than one of
     * courseCodes, prefix, or number.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by, e.g. "CMSC".
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    prefix?: string;

    /**
     * A course number to filter by across departments, e.g. "131".
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    number?: string;

    /**
     * Return only records for the instructor with this slug.
     *
     * Prefer this over filtering by name. The same person is spelled several
     * different ways across the Registrar's records, Testudo, and PlanetTerp —
     * "Walsh, Shane Bolles" against "Shane Walsh" — so an exact name match
     * silently returns nothing for a large share of instructors. A slug
     * resolves through instructor identity and cannot miss for that reason.
     *
     * Cannot be combined with instructorId or instructor.
     */
    instructorSlug?: string;

    /**
     * Return only records for this instructor id.
     * Cannot be combined with instructorSlug or instructor.
     */
    instructorId?: number;

    /**
     * Return only records whose instructor name matches this exactly, in
     * "First Last" order and case-sensitively.
     *
     * @deprecated Use `instructorSlug`. See the note there for why this misses.
     */
    instructor?: string;

    /**
     * Equalities and inequalities to filter by term code.
     */
    terms?: TermFilter;

    /**
     * Equalities and inequalities to filter by average GPA.
     */
    gpa?: GpaFilter;

    /**
     * Equalities and inequalities to filter by the number of students who
     * received a letter grade.
     */
    graded?: GradedFilter;

    /**
     * Which instructor attribution tiers to include. Defaults to all of them.
     *
     * Pass `new Set(["reported", "testudo", "lead"])` to exclude attributions
     * carried across lecture groups, which are the least reliable. See
     * `SectionGrades.instructor_source`.
     */
    instructorSources?: Set<string>;

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

export function gradesConfigToQueryParams(cfg: GradesConfig): URLSearchParams {
    const params = new URLSearchParams();
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.number) {
        params.append("number", cfg.number);
    }
    if (cfg.instructorSlug) {
        params.append("instructorSlug", cfg.instructorSlug);
    }
    if (cfg.instructorId !== null && cfg.instructorId !== undefined) {
        params.append("instructorId", cfg.instructorId.toString());
    }
    if (cfg.instructor) {
        params.append("instructor", cfg.instructor);
    }
    if (cfg.instructorSources && cfg.instructorSources.size > 0) {
        params.append("instructorSource", Array.from(cfg.instructorSources).join(","));
    }
    if (cfg.terms) {
        for (const arg of cfg.terms.argsArray()) {
            params.append("term", arg);
        }
    }
    if (cfg.gpa) {
        for (const arg of cfg.gpa.argsArray()) {
            params.append("gpa", arg);
        }
    }
    if (cfg.graded) {
        for (const arg of cfg.graded.argsArray()) {
            params.append("graded", arg);
        }
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
 * Configuration for a request to `/v0/grades/summary`, which returns grade
 * distributions with sections summed together.
 *
 * This is usually the endpoint you want. `groupBy: "course"` answers "how hard
 * is this course", `"term"` answers "has it changed", `"instructor"` answers
 * "who should I take it with", and `"instructorOverall"` answers "how does
 * this instructor grade in general".
 *
 * Fields:
 * - `groupBy?: GradeGroupBy`
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `number?: string`
 * - `instructorSlug?: string`
 * - `instructorId?: number`
 * - `includeCarried?: boolean`
 * - `terms?: TermFilter`
 * - `gpa?: GpaFilter`
 * - `minStudents?: number`
 * - `count?: boolean`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface GradeSummaryConfig {
    /**
     * How to group the results. Defaults to "course".
     *
     * `instructorOverall` and `instructorTerm` aggregate across every course,
     * so they cannot be combined with a course filter — the API returns 400
     * rather than silently ignoring it, because receiving an instructor's
     * average across everything when you asked about one course is not
     * something a caller can detect.
     */
    groupBy?: GradeGroupBy;

    /**
     * A set of course codes to get results for. Cannot set more than one of
     * courseCodes, prefix, or number, and none of them with an instructor-only
     * grouping.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by, e.g. "CMSC".
     */
    prefix?: string;

    /**
     * A course number to filter by across departments, e.g. "131".
     */
    number?: string;

    /**
     * Return only results for the instructor with this slug. Requires an
     * instructor grouping. See `GradesConfig.instructorSlug`.
     */
    instructorSlug?: string;

    /**
     * Return only results for this instructor id. Requires an instructor
     * grouping.
     */
    instructorId?: number;

    /**
     * Return only results whose instructor name matches exactly.
     * Requires an instructor grouping.
     *
     * @deprecated Use `instructorSlug`.
     */
    instructor?: string;

    /**
     * Only meaningful with `groupBy: "instructor"`. When true, also counts
     * sections whose instructor was carried across lecture groups or into a
     * differently-coded offering. Wider coverage, lower confidence.
     */
    includeCarried?: boolean;

    /**
     * Equalities and inequalities to filter by term code. Only valid with
     * `groupBy: "term"` or `"instructorTerm"`; the other groupings aggregate
     * across every term and reject this rather than ignoring it.
     */
    terms?: TermFilter;

    /**
     * Equalities and inequalities to filter by average GPA.
     */
    gpa?: GpaFilter;

    /**
     * Exclude groupings with fewer than this many students who received a
     * letter grade.
     *
     * Applied to `graded`, not `total` — the two are not comparable across
     * eras, and `graded` is what the GPA was computed from, so this threshold
     * means the same thing as the sample behind the number.
     */
    minStudents?: number;

    /**
     * If true, the total number of matching records is returned in
     * `ApiResponse.total`. Costs an extra aggregate on the server.
     */
    count?: boolean;

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

export function gradeSummaryConfigToQueryParams(cfg: GradeSummaryConfig): URLSearchParams {
    const params = new URLSearchParams();
    if (cfg.groupBy) {
        params.append("groupBy", cfg.groupBy);
    }
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.number) {
        params.append("number", cfg.number);
    }
    if (cfg.instructorSlug) {
        params.append("instructorSlug", cfg.instructorSlug);
    }
    if (cfg.instructorId !== null && cfg.instructorId !== undefined) {
        params.append("instructorId", cfg.instructorId.toString());
    }
    if (cfg.instructor) {
        params.append("instructor", cfg.instructor);
    }
    if (cfg.includeCarried) {
        params.append("includeCarried", "true");
    }
    if (cfg.terms) {
        for (const arg of cfg.terms.argsArray()) {
            params.append("term", arg);
        }
    }
    if (cfg.gpa) {
        for (const arg of cfg.gpa.argsArray()) {
            params.append("gpa", arg);
        }
    }
    if (cfg.minStudents !== null && cfg.minStudents !== undefined) {
        params.append("minStudents", cfg.minStudents.toString());
    }
    if (cfg.count) {
        params.append("count", "true");
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
 * Configuration for a request to `/v1/reviews`.
 *
 * Fields:
 * - `instructorSlug: string`
 * - `courseCode?: string`
 * - `limit?: number`
 * - `offset?: number`
 */
export interface ReviewsConfig {
    /**
     * Whose reviews to return. Required.
     */
    instructorSlug: string;

    /**
     * Restrict to reviews about one course.
     */
    courseCode?: string;

    /**
     * The number of results to return. Defaults to 25.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;
}

export function reviewsConfigToQueryParams(cfg: ReviewsConfig): URLSearchParams {
    const params = new URLSearchParams();
    params.append("instructorSlug", cfg.instructorSlug);
    if (cfg.courseCode) {
        params.append("courseCode", cfg.courseCode);
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    return params;
}
