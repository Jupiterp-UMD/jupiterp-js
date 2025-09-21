import { CoursesConfig, InstructorsConfig, SectionsConfig } from "./configs";
import { CoursesMinifiedResponse, CoursesResponse, CoursesBasicResponse, InstructorsResponse, SectionsResponse } from "./responses";
/**
 * A client for interacting with the Jupiterp API v0.
 */
export declare class JupiterpClientV0 {
    readonly dbUrl: string;
    constructor(dbUrl: string);
    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV0.
     */
    static createDefault(): JupiterpClientV0;
    /**
     * Get a health check response from the API.
     * @returns A promise that resolves to a simple text message if the API
     * is reachable.
     */
    health(): Promise<Response>;
    /**
     * Get a list of courses based on the provided configuration. These are
     * basic course objects without sections information. For courses with
     * sections, use `coursesWithSections`.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course data.
     */
    courses(cfg: CoursesConfig): Promise<CoursesBasicResponse>;
    /**
     * Get a list of minified courses.
     */
    minifiedCourses(cfg: CoursesConfig): Promise<CoursesMinifiedResponse>;
    /**
     * Get a list of courses along with their sections based on the provided
     * configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course
     * and section data.
     */
    coursesWithSections(cfg: CoursesConfig): Promise<CoursesResponse>;
    /**
     * Get a list of sections based on the provided configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the section data.
     */
    sections(cfg: SectionsConfig): Promise<SectionsResponse>;
    instructorsGeneric(path: string, cfg: InstructorsConfig): Promise<InstructorsResponse>;
    /**
     * Get a list of all instructors and their average ratings, including
     * instructors not actively teaching any courses.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    instructors(cfg: InstructorsConfig): Promise<InstructorsResponse>;
    /**
     * Get instructors that are currently teaching a course, as listed on Testudo,
     * based on the configuration provided.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    activeInstructors(cfg: InstructorsConfig): Promise<InstructorsResponse>;
}
//# sourceMappingURL=client.d.ts.map