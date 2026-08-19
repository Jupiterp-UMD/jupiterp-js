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
import type { Department, DepartmentRaw } from "../common/department.js";
import { type Instructor } from "../common/instructor.js";
import {
    parseRawSection,
    type Section,
    type SectionRaw
} from "../common/section.js";
import {
    type CoursesConfig, 
    coursesConfigToQueryParams,
    type CoursesWithSectionsConfig,
    coursesWithSectionsConfigToQueryParams,
    type GradesConfig,
    gradesConfigToQueryParams,
    type GradeSummaryConfig,
    gradeSummaryConfigToQueryParams,
    type InstructorsConfig,
    instructorsConfigToQueryParams,
    type ReviewsConfig,
    reviewsConfigToQueryParams,
    type SectionsConfig,
    sectionsConfigToQueryParams
} from "./configs.js";
import { ApiResponse,
    type CoursesMinifiedResponse,
    type CoursesResponse,
    type CoursesBasicResponse,
    type CourseGradeSummaryResponse,
    type CourseInstructorGradeSummaryResponse,
    type CourseTermGradeSummaryResponse,
    type GradesResponse,
    type GradeTermsResponse,
    type InstructorGradeSummaryResponse,
    type InstructorsResponse,
    type InstructorTermGradeSummaryResponse,
    parseContentRange,
    type ReviewsResponse,
    type SectionsResponse,
    type DepartmentsResponse
} from "./responses.js";
import type {
    CourseGradeSummary,
    CourseInstructorGradeSummary,
    CourseTermGradeSummary,
    GradeTerm,
    InstructorGradeSummary,
    InstructorTermGradeSummary,
    SectionGrades
} from "../common/grades.js";
import type {
    Review,
    ReviewSubmission,
    SubmitReviewResult,
    VerifyReviewResult
} from "../common/review.js";

/**
 * The URL `createDefault` connects to.
 *
 * Defined once so that the two client classes below cannot disagree about it.
 *
 * This pointed at `http://localhost:8080` during development, guarded only by a
 * unit test that was expected to fail. That guard does not hold on its own:
 * `prepublishOnly` ran the build and not the tests, so nothing mechanically
 * stopped a release from shipping a client that only worked on one machine.
 * `prepublishOnly` now runs the unit suite, which makes this constant and that
 * test enforce each other.
 *
 * To develop against a local API, construct the client directly --
 * `new JupiterpClientV1('http://localhost:8080')` -- rather than editing this.
 */
const DEFAULT_API_URL = 'https://api.jupiterp.com';

/**
 * Shared implementation of the Jupiterp API client.
 *
 * The read endpoints (courses, sections, instructors, grades, departments) are
 * served under both `/v1` and `/v0` by the same handlers, returning the same
 * data. Which prefix an instance uses is fixed by its subclass, and is the only
 * difference between {@link JupiterpClientV1} and {@link JupiterpClientV0}.
 *
 * Review endpoints are not versioned this way -- they have only ever existed
 * under `/v1` -- so they are written as literal `/v1` paths throughout and are
 * identical on both clients.
 */
abstract class JupiterpClientBase {
    readonly dbUrl: string;

    /** The path prefix this client sends read requests to. */
    protected readonly readPrefix: string;

    protected constructor(dbUrl: string, readPrefix: string) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
        this.readPrefix = readPrefix;
    }

    /**
     * Get a health check response from the API.
     * @returns A promise that resolves to a simple text message if the API
     * is reachable.
     */
    public async health(): Promise<Response> {
        return fetch(this.dbUrl + this.readPrefix + "/");
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
        const url = `${this.dbUrl}${this.readPrefix}/courses?${params.toString()}`;
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
        const url = `${this.dbUrl}${this.readPrefix}/courses/minified?${params.toString()}`;
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
    public async coursesWithSections(
                    cfg: CoursesWithSectionsConfig): Promise<CoursesResponse> {
        const params = coursesWithSectionsConfigToQueryParams(cfg);
        const url = `${this.dbUrl}${this.readPrefix}/courses/withSections?${params.toString()}`;
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
        const url = `${this.dbUrl}${this.readPrefix}/sections?${params.toString()}`;
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

        // Paging this endpoint is stable because the API applies a default
        // `sortBy=slug.asc`, not because of anything done here. Without a total
        // order, limit/offset over an unordered result skips and repeats rows:
        // a full walk returned all 2,976 rows but only 2,336 distinct
        // professors, a different ~640 missing each time. Fixed server-side so
        // every client gets it, since a caller cannot tell from a
        // correct-looking page that rows were dropped.
        const url = `${this.dbUrl}${this.readPrefix}/${path}?${params.toString()}`;
        const resp = await fetch(url);
        const statusCode = resp.status;
        const statusMessage = resp.statusText;
        if (!resp.ok) {
            const errorBody = await resp.text();
            return new ApiResponse<Instructor>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await resp.json()) as Instructor[];
        const total = parseContentRange(resp.headers.get("Content-Range"));
        return new ApiResponse<Instructor>(statusCode, statusMessage, data, undefined, total);
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
        const url = `${this.dbUrl}${this.readPrefix}/deptList`;
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<Department>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as DepartmentRaw[];
        const processed: Department[] = data.map((d) => {
            return {
                deptCode: d.dept_code,
                name: d.name,
            };
        });
        return new ApiResponse<Department>(statusCode, statusMessage, processed);
    }

    /**
     * Shared plumbing for the grade endpoints, which all return plain JSON
     * arrays and may carry a total in `Content-Range`.
     */
    private async getJson<T>(url: string): Promise<ApiResponse<T>> {
        const res = await fetch(url);
        const statusCode = res.status;
        const statusMessage = res.statusText;
        if (!res.ok) {
            const errorBody = await res.text();
            return new ApiResponse<T>(statusCode, statusMessage, null, errorBody);
        }

        const data = (await res.json()) as T[];
        const total = parseContentRange(res.headers.get("Content-Range"));
        return new ApiResponse<T>(statusCode, statusMessage, data, undefined, total);
    }

    /**
     * Get grade distributions for individual sections.
     *
     * This is the raw, per-section data. For almost every purpose you want
     * `gradeSummary` instead, which does the summing server-side.
     *
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the
     * section-level grade data.
     */
    public async grades(cfg: GradesConfig): Promise<GradesResponse> {
        const params = gradesConfigToQueryParams(cfg);
        return this.getJson<SectionGrades>(`${this.dbUrl}${this.readPrefix}/grades?${params.toString()}`);
    }

    /**
     * Get grade distributions for one or more courses, summed across every
     * term on record.
     *
     * ```ts
     * const resp = await client.courseGrades({
     *     courseCodes: new Set(["CMSC132"]),
     * });
     * ```
     *
     * @param cfg A configuration object specifying filters and options for the
     * request. `groupBy` is ignored.
     * @returns A promise that resolves to an ApiResponse containing one record
     * per course.
     */
    public async courseGrades(cfg: GradeSummaryConfig): Promise<CourseGradeSummaryResponse> {
        const params = gradeSummaryConfigToQueryParams({ ...cfg, groupBy: "course" });
        return this.getJson<CourseGradeSummary>(
            `${this.dbUrl}${this.readPrefix}/grades/summary?${params.toString()}`);
    }

    /**
     * Get grade distributions for one or more courses, broken out by term.
     * The shape a "has this course got harder?" chart wants.
     *
     * @param cfg A configuration object specifying filters and options for the
     * request. `groupBy` is ignored.
     * @returns A promise that resolves to an ApiResponse containing one record
     * per course per term.
     */
    public async courseTermGrades(
        cfg: GradeSummaryConfig
    ): Promise<CourseTermGradeSummaryResponse> {
        const params = gradeSummaryConfigToQueryParams({ ...cfg, groupBy: "term" });
        return this.getJson<CourseTermGradeSummary>(
            `${this.dbUrl}${this.readPrefix}/grades/summary?${params.toString()}`);
    }

    /**
     * Get grade distributions broken out by instructor within a course, which
     * answers "who should I take this with?".
     *
     * Can also be filtered by `instructorSlug` instead of by course, to get one
     * instructor's grades broken out by each course they have taught.
     *
     * @param cfg A configuration object specifying filters and options for the
     * request. `groupBy` is ignored.
     * @returns A promise that resolves to an ApiResponse containing one record
     * per course per instructor.
     */
    public async courseInstructorGrades(
        cfg: GradeSummaryConfig
    ): Promise<CourseInstructorGradeSummaryResponse> {
        const params = gradeSummaryConfigToQueryParams({ ...cfg, groupBy: "instructor" });
        return this.getJson<CourseInstructorGradeSummary>(
            `${this.dbUrl}${this.readPrefix}/grades/summary?${params.toString()}`);
    }

    /**
     * Get one instructor's grades summed across every course they have taught.
     *
     * ```ts
     * const resp = await client.instructorGrades({
     *     instructorSlug: "shane-walsh",
     * });
     * ```
     *
     * Takes no course filter: this aggregates across all of them, and the API
     * returns 400 rather than silently ignoring one.
     *
     * @param cfg A configuration object specifying filters and options for the
     * request. `groupBy` is ignored.
     * @returns A promise that resolves to an ApiResponse containing one record
     * per instructor.
     */
    public async instructorGrades(
        cfg: GradeSummaryConfig
    ): Promise<InstructorGradeSummaryResponse> {
        const params = gradeSummaryConfigToQueryParams({ ...cfg, groupBy: "instructorOverall" });
        return this.getJson<InstructorGradeSummary>(
            `${this.dbUrl}${this.readPrefix}/grades/summary?${params.toString()}`);
    }

    /**
     * Get one instructor's grades broken out by term, which answers "is this
     * instructor grading more harshly than they used to?".
     *
     * @param cfg A configuration object specifying filters and options for the
     * request. `groupBy` is ignored.
     * @returns A promise that resolves to an ApiResponse containing one record
     * per instructor per term.
     */
    public async instructorTermGrades(
        cfg: GradeSummaryConfig
    ): Promise<InstructorTermGradeSummaryResponse> {
        const params = gradeSummaryConfigToQueryParams({ ...cfg, groupBy: "instructorTerm" });
        return this.getJson<InstructorTermGradeSummary>(
            `${this.dbUrl}${this.readPrefix}/grades/summary?${params.toString()}`);
    }

    /**
     * Get every term for which grade data is available, newest first.
     *
     * Grade data covers Fall and Spring terms only; Winter and Summer are not
     * included, so their absence from this list is expected rather than a gap
     * waiting to be filled.
     *
     * @returns A promise that resolves to an ApiResponse containing the terms.
     */
    public async gradeTerms(): Promise<GradeTermsResponse> {
        return this.getJson<GradeTerm>(`${this.dbUrl}${this.readPrefix}/grades/terms`);
    }

    /**
     * Get approved reviews for an instructor, newest first.
     *
     * Only approved reviews are ever returned: reviews are moderated before
     * they are published, and the endpoint cannot express an unapproved one.
     * Nothing identifying the reviewer is included.
     *
     * @param cfg A configuration object specifying whose reviews to fetch.
     * @returns A promise that resolves to an ApiResponse containing the
     * reviews.
     */
    public async reviews(cfg: ReviewsConfig): Promise<ReviewsResponse> {
        const params = reviewsConfigToQueryParams(cfg);
        return this.getJson<Review>(`${this.dbUrl}/v1/reviews?${params.toString()}`);
    }

    /**
     * Submit a review of an instructor.
     *
     * The review is not published, or even fully submitted, until the reviewer
     * clicks a confirmation link emailed to the address given. It is then read
     * by a moderator before it appears.
     *
     * The response is deliberately the same whether or not that address has
     * already reviewed this instructor. Do not try to read anything finer than
     * "accepted" out of it — a distinguishable answer would let anyone use this
     * endpoint to find out whether a particular person reviewed a particular
     * professor.
     *
     * @param review The review to submit.
     * @returns A promise resolving to whether it was accepted, and a
     * displayable message if it was not.
     */
    public async submitReview(review: ReviewSubmission): Promise<SubmitReviewResult> {
        const res = await fetch(`${this.dbUrl}/v1/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instructor_slug: review.instructorSlug,
                course_code: review.courseCode,
                term: review.term,
                rating: review.rating,
                expected_grade: review.expectedGrade,
                title: review.title,
                body: review.body,
                email: review.email,
                captcha_token: review.captchaToken,
            }),
        });

        if (res.ok) {
            return { ok: true };
        }

        const payload = await res.json().catch(() => ({
            error: "Something went wrong.",
        })) as { error?: string };

        return {
            ok: false,
            error: payload.error ?? "Something went wrong.",
            rateLimited: res.status === 429,
        };
    }

    /**
     * Confirm a review using the token from its verification email.
     *
     * Returns the management key exactly once. There is deliberately nothing
     * linking it back to a person, so it cannot be recovered — show it to the
     * reviewer and tell them to keep it.
     *
     * Safe to call twice: a repeat returns success rather than an error,
     * because mail clients prefetch links and people double-click.
     *
     * @param token The token from the emailed link.
     * @returns A promise resolving to the outcome and, on first use, the
     * management key.
     */
    public async verifyReview(token: string): Promise<VerifyReviewResult> {
        const res = await fetch(
            `${this.dbUrl}/v1/reviews/verify/${encodeURIComponent(token)}`);
        const payload = await res.json().catch(() => ({})) as {
            manage_key?: string,
            message?: string,
            error?: string,
        };
        return {
            ok: res.ok,
            manageKey: payload.manage_key,
            message: payload.message ?? payload.error ?? "Something went wrong.",
        };
    }

    /**
     * Withdraw a review, using the management key returned when it was
     * confirmed. The review's text is deleted.
     *
     * @param id The review's id.
     * @param manageKey The key returned by `verifyReview`.
     * @returns A promise resolving to whether the withdrawal was accepted.
     */
    public async withdrawReview(id: string, manageKey: string): Promise<boolean> {
        const res = await fetch(`${this.dbUrl}/v1/reviews/${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${manageKey}` },
        });
        return res.ok;
    }

    /**
     * Report a published review for breaching the content policy.
     *
     * @param id The review's id.
     * @param reason Which part of the policy it breaches.
     * @param detail Any further context.
     * @returns A promise resolving to whether the report was accepted.
     */
    public async reportReview(
        id: string,
        reason: string,
        detail?: string
    ): Promise<boolean> {
        const res = await fetch(
            `${this.dbUrl}/v1/reviews/${encodeURIComponent(id)}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, detail }),
            });
        return res.ok;
    }
}

/**
 * A client for the Jupiterp API, reading from `/v1`.
 *
 * This is the client to use. `/v1` is where the read surface lives.
 */
export class JupiterpClientV1 extends JupiterpClientBase {
    public constructor(dbUrl: string) {
        super(dbUrl, "/v1");
    }

    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV1.
     */
    public static createDefault(): JupiterpClientV1 {
        return new JupiterpClientV1(DEFAULT_API_URL);
    }
}

/**
 * A client for the Jupiterp API, reading from `/v0`.
 *
 * @deprecated Use {@link JupiterpClientV1}. This class is kept because it is
 * the export this package published in 1.x, and removing it would break every
 * existing consumer for no benefit. It is not broken and is not scheduled for
 * removal: `/v0` is a permanent alias for the same handlers, so this returns
 * byte-identical data to {@link JupiterpClientV1}. The only reason to prefer
 * the newer class is that `/v0` is no longer the documented prefix.
 */
export class JupiterpClientV0 extends JupiterpClientBase {
    public constructor(dbUrl: string) {
        super(dbUrl, "/v0");
    }

    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV0.
     */
    public static createDefault(): JupiterpClientV0 {
        return new JupiterpClientV0(DEFAULT_API_URL);
    }
}
