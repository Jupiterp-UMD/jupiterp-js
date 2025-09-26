import type {
    Course,
    CourseBasic,
    CourseMinified
} from "../common/course.js";
import type {Instructor } from "../common/instructor.js";
import type { Section } from "../common/section.js";

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

    constructor(statusCode: number, statusMessage: string,
                data: T[] | null, errorBody?: string) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
        this.errorBody = errorBody;
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
export type DepartmentsResponse = ApiResponse<string>;