import { CourseBasic, CourseMinified } from "../common/course";
import { Instructor } from "../common/instructor";
import { Section } from "../common/section";

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
     * The data returned by the API, or null if there was an error.
     */
    public data: T[] | null;

    constructor(statusCode: number, statusMessage: string, data: T[] | null) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }

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
export type CourseMinifiedResponse = ApiResponse<CourseMinified>;

/**
 * A response to a sections request.
 */
export type SectionsResponse = ApiResponse<Section>;

/**
 * A response to an instructor request.
 */
export type InstructorResponse = ApiResponse<Instructor>;