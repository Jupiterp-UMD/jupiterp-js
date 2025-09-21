import { parseRawCourse, parseRawCourseBasic, parseRawCourseMinified } from "../common/course";
import { parseRawSection } from "../common/section";
import { coursesConfigToQueryParams, instructorsConfigToQueryParams, sectionsConfigToQueryParams } from "./configs";
import { ApiResponse } from "./responses";
/**
 * A client for interacting with the Jupiterp API v0.
 */
export class JupiterpClientV0 {
    constructor(dbUrl) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
    }
    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV0.
     */
    static createDefault() {
        return new JupiterpClientV0("https://api.jupiterp.com");
    }
    /**
     * Get a health check response from the API.
     * @returns A promise that resolves to a simple text message if the API
     * is reachable.
     */
    async health() {
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
    async courses(cfg) {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse(statusCode, statusMessage, null);
        }
        const data = (await res.json());
        const courses = data.map(parseRawCourseBasic);
        return new ApiResponse(statusCode, statusMessage, courses);
    }
    /**
     * Get a list of minified courses.
     */
    async minifiedCourses(cfg) {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses/minified?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse(statusCode, statusMessage, null);
        }
        const data = (await res.json());
        return new ApiResponse(statusCode, statusMessage, data.map(parseRawCourseMinified));
    }
    /**
     * Get a list of courses along with their sections based on the provided
     * configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course
     * and section data.
     */
    async coursesWithSections(cfg) {
        const params = coursesConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/courses/withSections?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse(statusCode, statusMessage, null);
        }
        const data = (await res.json());
        const courses = data.map(parseRawCourse);
        return new ApiResponse(statusCode, statusMessage, courses);
    }
    /**
     * Get a list of sections based on the provided configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the section data.
     */
    async sections(cfg) {
        const params = sectionsConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/sections?${params.toString()}`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            return new ApiResponse(statusCode, statusMessage, null);
        }
        const data = (await res.json());
        const sections = data.map(parseRawSection);
        return new ApiResponse(statusCode, statusMessage, sections);
    }
    async instructorsGeneric(path, cfg) {
        const params = instructorsConfigToQueryParams(cfg);
        const url = `${this.dbUrl}/v0/${path}?${params.toString()}`;
        const resp = await fetch(url);
        const statusCode = resp.status;
        const statusMessage = resp.statusText;
        if (!resp.ok) {
            return new ApiResponse(statusCode, statusMessage, null);
        }
        const data = (await resp.json());
        return new ApiResponse(statusCode, statusMessage, data);
    }
    /**
     * Get a list of all instructors and their average ratings, including
     * instructors not actively teaching any courses.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    async instructors(cfg) {
        return this.instructorsGeneric("instructors", cfg);
    }
    /**
     * Get instructors that are currently teaching a course, as listed on Testudo,
     * based on the configuration provided.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    async activeInstructors(cfg) {
        return this.instructorsGeneric("instructors/active", cfg);
    }
}
