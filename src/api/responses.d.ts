import { Course, CourseBasic, CourseMinified } from "../common/course";
import { Instructor } from "../common/instructor";
import { Section } from "../common/section";
/**
 * A generic API response wrapper that includes status information and the data
 * returned by the API.
 */
export declare class ApiResponse<T> {
    /**
     * The HTTP status code of the response.
     */
    statusCode: number;
    /**
     * The HTTP status message of the response.
     */
    statusMessage: string;
    /**
     * The data returned by the API, or null if there was an error.
     */
    data: T[] | null;
    constructor(statusCode: number, statusMessage: string, data: T[] | null);
    /**
     * Checks if the response was successful.
     * @returns True if the response status code indicates success (2xx), false otherwise.
     */
    ok(): boolean;
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
//# sourceMappingURL=responses.d.ts.map