import {
    type Course,
    type CourseBasic,
    type CourseBasicRaw,
    type CourseMinified,
    type CourseMinifiedRaw,
    type CourseRaw,
    parseRawCourse,
    parseRawCourseBasic,
    parseRawCourseMinified
} from "../common/course.js";
import type { DeptCode } from "../common/dept-code.js";
import { type Instructor } from "../common/instructor.js";
import {
    parseRawSection,
    type Section,
    type SectionRaw
} from "../common/section.js";
import {
    type CoursesConfig, 
    coursesConfigToQueryParams,
    type InstructorsConfig,
    instructorsConfigToQueryParams,
    type SectionsConfig,
    sectionsConfigToQueryParams
} from "./configs.js";
import { ApiResponse,
    type CoursesMinifiedResponse,
    type CoursesResponse,
    type CoursesBasicResponse,
    type InstructorsResponse,
    type SectionsResponse,
    type DepartmentsResponse
} from "./responses.js";

/**
 * A client for interacting with the Jupiterp API v0.
 */
export class JupiterpClientV0 {
    readonly dbUrl: string;

    public constructor(dbUrl: string) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
    }

    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV0.
     */
    public static createDefault(): JupiterpClientV0 {
        return new JupiterpClientV0("https://api.jupiterp.com");
    }

    /**
     * Get a health check response from the API.
     * @returns A promise that resolves to a simple text message if the API
     * is reachable.
     */
    public async health(): Promise<Response> {
        return fetch(this.dbUrl + "/v0/");
    }

    /**
     * Get a list of courses based on the provided configuration. These are
     * basic course objects without sections information. For courses with
     * sections, use `coursesWithSections`.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course data.
     */
    public async courses(cfg: CoursesConfig): Promise<CoursesBasicResponse> {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<CourseBasic>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as CourseBasicRaw[];
        const courses = data.map(parseRawCourseBasic);
        return new ApiResponse<CourseBasic>(statusCode, statusMessage, courses);
    }

    /**
     * Get a list of minified courses.
     */
    public async minifiedCourses(cfg: CoursesConfig): Promise<CoursesMinifiedResponse> {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses/minified?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<CourseMinified>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as CourseMinifiedRaw[];
        return new ApiResponse<CourseMinified>(statusCode, statusMessage, data.map(parseRawCourseMinified));
    }

    /**
     * Get a list of courses along with their sections based on the provided
     * configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course
     * and section data.
     */
    public async coursesWithSections(cfg: CoursesConfig): Promise<CoursesResponse> {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses/withSections?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<Course>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as CourseRaw[];
        const courses = data.map(parseRawCourse);
        return new ApiResponse<Course>(statusCode, statusMessage, courses);
    }

    /**
     * Get a list of sections based on the provided configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the section data.
     */
    public async sections(cfg: SectionsConfig): Promise<SectionsResponse> {
        const params = sectionsConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/sections?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<Section>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as SectionRaw[];
        const sections = data.map(parseRawSection);
        return new ApiResponse<Section>(statusCode, statusMessage, sections);
    }

    async instructorsGeneric(path: string, cfg: InstructorsConfig): Promise<InstructorsResponse> {
        const params = instructorsConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/${path}?${params.toString()}`;
        const resp = await fetch(url);
        const statusCode = resp.status;
        const statusMessage = resp.statusText;
        if (!resp.ok) {
            const errorBody = await resp.text();
            return new ApiResponse<Instructor>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await resp.json()) as Instructor[];
        return new ApiResponse<Instructor>(statusCode, statusMessage, data);
    }

    /**
     * Get a list of all instructors and their average ratings, including
     * instructors not actively teaching any courses.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    public async instructors(cfg: InstructorsConfig): Promise<InstructorsResponse> {
        return this.instructorsGeneric("instructors", cfg);
    }

    /**
     * Get instructors that are currently teaching a course, as listed on Testudo,
     * based on the configuration provided.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    public async activeInstructors(cfg: InstructorsConfig): Promise<InstructorsResponse> {
        return this.instructorsGeneric("instructors/active", cfg);
    }

    /**
     * Get a list of unique 4-letter department codes.
     * @returns A promise that resolves to an ApiResponse containing the list
     * of unique 4-letter department codes.
     */
    public async deptList(): Promise<DepartmentsResponse> {
        const url = `${this.dbUrl}/v0/deptList`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<string>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as DeptCode[];
        const deptCodes = data.map((d) => d.dept_code);
        return new ApiResponse<string>(statusCode, statusMessage, deptCodes);
    }
}