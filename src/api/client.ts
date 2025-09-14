import { CourseBasic, CourseBasicRaw, CourseMinified, CourseMinifiedRaw, parseRawCourseBasic, parseRawCourseMinified } from "../common/course";
import { Instructor } from "../common/instructor";
import { parseRawSection, Section, SectionRaw } from "../common/section";
import { courseConfigToQueryParams, CoursesConfig, InstructorConfig, instructorConfigToQueryParams, sectionConfigToQueryParams, SectionsConfig } from "./configs";
import { ApiResponse, CourseMinifiedResponse, CoursesBasicResponse, InstructorResponse, SectionsResponse } from "./responses";

export class JupiterpClientV0 {
    readonly dbUrl: string;

    public constructor(dbUrl: string) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
    }

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
        const params = courseConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse<CourseBasic>(statusCode, statusMessage, null);
        }

        const data = (await res.json()) as CourseBasicRaw[];
        const courses = data.map(parseRawCourseBasic);
        return new ApiResponse<CourseBasic>(statusCode, statusMessage, courses);
    }

    /**
     * Get a list of minified courses.
     */
    public async minifiedCourses(cfg: CoursesConfig): Promise<CourseMinifiedResponse> {
        const params = courseConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses/minified?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse<CourseMinified>(statusCode, statusMessage, null);
        }

        const data = (await res.json()) as CourseMinifiedRaw[];
        return new ApiResponse<CourseMinified>(statusCode, statusMessage, data.map(parseRawCourseMinified));
    }

    /**
     * Get a list of sections based on the provided configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the section data.
     */
    public async sections(cfg: SectionsConfig): Promise<SectionsResponse> {
        const params = sectionConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/sections?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse<Section>(statusCode, statusMessage, null);
        }

        const data = (await res.json()) as SectionRaw[];
        const sections = data.map(parseRawSection);
        return new ApiResponse<Section>(statusCode, statusMessage, sections);
    }

    async instructorsGeneric(path: string, cfg: InstructorConfig): Promise<InstructorResponse> {
        const params = instructorConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/${path}?${params.toString()}`;
        const resp = await fetch(url);
        const statusCode = resp.status;
        const statusMessage = resp.statusText;
        if (!resp.ok) {
            return new ApiResponse<Instructor>(statusCode, statusMessage, null);
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
    public async instructors(cfg: InstructorConfig): Promise<InstructorResponse> {
        return this.instructorsGeneric("instructors", cfg);
    }

    /**
     * Get instructors that are currently teaching a course, as listed on Testudo,
     * based on the configuration provided.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    public async activeInstructors(cfg: InstructorConfig): Promise<InstructorResponse> {
        return this.instructorsGeneric("instructors/active", cfg);
    }
}