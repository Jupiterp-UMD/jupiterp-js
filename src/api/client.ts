import { Instructor } from "../common/instructor";
import { InstructorConfig, instructorConfigToQueryParams } from "./configs";
import { ApiResponse, InstructorResponse } from "./responses";

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

    public async health(): Promise<Response> {
        return fetch(this.dbUrl + "/v0/");
    }

    // public async sections(): Promise<SectionsResponse> {
        
    // }

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