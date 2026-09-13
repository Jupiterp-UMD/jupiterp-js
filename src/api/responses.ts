import type {
    Course,
    CourseBasic,
    CourseMinified
} from "../common/course.js";
import type { Department } from "../common/department.js";
import type {Instructor } from "../common/instructor.js";
import type { Section } from "../common/section.js";
import type {
    CourseGradeSummary,
    CourseInstructorGradeSummary,
    CourseTermGradeSummary,
    GradeTerm,
    InstructorGradeSummary,
    InstructorTermGradeSummary,
    SectionGrades,
} from "../common/grades.js";
import type { Review } from "../common/review.js";

/**
 * A generic API response wrapper that includes status information and the data
 * returned by the API.
 */
export class ApiResponse<T> {
    /**
     * The HTTP status code of the response.
     */
    public statusCode: number;

    /**
     * The HTTP status message of the response.
     */
    public statusMessage: string;

    /**
     * An optional error message returned by the API.
     */
    public errorBody?: string;

    /**
     * The data returned by the API, or null if there was an error.
     */
    public data: T[] | null;

    /**
     * The total number of records matching the request, ignoring paging.
     *
     * Null unless the request asked for it by setting `count: true`, since
     * counting costs the server an extra aggregate over the filtered set.
     * Use it to render "1-50 of 4,812" or to know how many pages exist —
     * without it the only way to find the end is to request past it.
     */
    public total: number | null;

    constructor(statusCode: number, statusMessage: string,
                data: T[] | null, errorBody?: string,
                total?: number | null) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
        this.errorBody = errorBody;
        this.total = total ?? null;
    }

    /**
     * Checks if the response was successful.
     * @returns True if the response status code indicates success (2xx), false otherwise.
     */
    public ok(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300;
    }
}

/**
 * A response to a basic courses request (no sections information).
 */
export type CoursesBasicResponse = ApiResponse<CourseBasic>;

/**
 * A response to a minified courses request.
 */
export type CoursesMinifiedResponse = ApiResponse<CourseMinified>;

/**
 * A response to a full courses request (with sections information).
 */
export type CoursesResponse = ApiResponse<Course>;

/**
 * A response to a sections request.
 */
export type SectionsResponse = ApiResponse<Section>;

/**
 * A response to an instructor request.
 */
export type InstructorsResponse = ApiResponse<Instructor>;

/**
 * A response to a departments list request.
 */
export type DepartmentsResponse = ApiResponse<Department>;

/**
 * Read the total record count out of a PostgREST `Content-Range` header.
 *
 * The header looks like `0-49/4812`, or `*​/0` for an empty result. The total
 * is `*` when the request did not ask for an exact count, which is not an
 * error — it means the caller did not pay for one.
 *
 * @param header The raw `Content-Range` header value, or null if absent.
 * @returns The total, or null if it was not reported.
 */
export function parseContentRange(header: string | null): number | null {
    if (header === null) {
        return null;
    }
    const total = header.split("/")[1];
    if (total === undefined || total === "*") {
        return null;
    }
    const parsed = Number.parseInt(total, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

/**
 * A response to a request for section-level grade distributions.
 */
export type GradesResponse = ApiResponse<SectionGrades>;

/**
 * A response to a grade summary request grouped by course.
 */
export type CourseGradeSummaryResponse = ApiResponse<CourseGradeSummary>;

/**
 * A response to a grade summary request grouped by course and term.
 */
export type CourseTermGradeSummaryResponse = ApiResponse<CourseTermGradeSummary>;

/**
 * A response to a grade summary request grouped by course and instructor.
 */
export type CourseInstructorGradeSummaryResponse = ApiResponse<CourseInstructorGradeSummary>;

/**
 * A response to a grade summary request grouped by instructor, across every
 * course they have taught.
 */
export type InstructorGradeSummaryResponse = ApiResponse<InstructorGradeSummary>;

/**
 * A response to a grade summary request grouped by instructor and term.
 */
export type InstructorTermGradeSummaryResponse = ApiResponse<InstructorTermGradeSummary>;

/**
 * A response to a request for the terms grade data is available for.
 */
export type GradeTermsResponse = ApiResponse<GradeTerm>;

/**
 * A response to a request for an instructor's reviews.
 */
export type ReviewsResponse = ApiResponse<Review>;
