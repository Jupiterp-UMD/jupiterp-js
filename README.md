# Jupiterp SDK

> ### Upgrading from v0.x to v1.0.0
>
> Two things change in ways that will not produce a compile error.
>
> **Instructor slugs changed format.** `Instructor.slug` held PlanetTerp's slug
> (`abadi_daniel`); it is now Jupiterp's own (`daniel-abadi`), and it is the
> path segment for professor pages. A slug saved by an earlier version will
> match nothing rather than fail loudly. PlanetTerp's value is preserved as
> `pt_slug`, so old identifiers can still be resolved:
>
> ```ts
> // Migrating a stored PlanetTerp slug to the current one
> const resp = await client.instructors({ instructorSlugs: new Set(["abadi_daniel"]) });
> // returns nothing in v1. Query the API for the instructor by name, or map
> // through pt_slug, then store `slug` going forward.
> ```
>
> **`average_rating` means something different.** It was PlanetTerp's rating.
> It is now a blend of reviews submitted on Jupiterp and the frozen PlanetTerp
> baseline, weighted by recency. The type is unchanged, so nothing breaks —
> the number just means something else. Prefer `combined_rating`, which is the
> same value as a `number`, and use `jupiterp_rating` / `pt_average_rating` if
> you need the two sources separately.
>
> Everything else added in v1.0.0 is additive: grade distributions, instructor
> name search, review reading and submission, and `ApiResponse.total`.

The Jupiterp SDK is a TypeScript library that wraps the [Jupiterp API](https://api.jupiterp.com). The SDK allows for easy calls to the API and returns data in structured, typed formats. This library is currently in pre-release; expect breaking changes. To get updates on the SDK's progress, email [admin@jupiterp.com](mailto:admin@jupiterp.com).

## Adding Jupiterp SDK to your project

Add Jupiterp as a dependency to your project:

With npm:
```bash
npm install @jupiterp/jupiterp
```

With yarn:
```bash
yarn add @jupiterp/jupiterp
```

## Using the Jupiterp Client to call the API

### Connecting to the API

To use the SDK, import the Jupiterp Client into your code, then create an instance of the Client. A default Client will automatically connect to the live API using `createDefault()`, but the Client can also be manually constructed to pull from a custom, compatible API's URL. This is available for public use, but unless you are running your own API, you will likely want to use `createDefault()`.

```ts
import { JupiterpClientV0 } from '@jupiterp/jupiterp';

// Using the default Client
const defaultClient = JupiterpClientV0.createDefault();
// Perform a health check to ensure the API is up
const response = await defaultClient.health();
console.log(response.ok); // true unless API is unreachable

// Using a custom Client
const customClient = new JupiterpClientV0("127.0.0.1");
const customResponse = await customClient.health();
console.log(customResponse.ok);
```

### Getting data from the API

The Jupiterp Client allows for calls to get course, section, and instructor data from the Jupiterp API. There is one method on the `JupiterpClientV0` class for each endpoint (see endpoints on the [Jupiterp API docs](https://api.jupiterp.com)).

#### Using configs

All endpoints (except `health()`) take a config object, which contains the configuration for the request. See the API docs for more info on the possible parameters that can be set for these endpoints. A config object is an interface, so it can be created easily:

```ts
import { CoursesConfig, InstructorsConfig, SectionsConfig } from '@jupiterp/jupiterp`;

// For course endpoints without sections
const cCfg: CoursesConfig = {
    courseCodes: new Set(["CMSC131", "MATH140"]),
    limit: 10,
    offset: 0,
    sortBy: new SortBy().ascending("course_code"),
};

// For course endpoints with sections
const csCfg: CoursesWithSectionsConfig = {
    courseCodes: new Set(["CMSC131", "MATH140"]),
    onlyOpen: true,
    instructor: "Darryll Pines",
    limit: 10,
    offset: 0,
    sortBy: new SortBy().ascending("course_code"),
};

// For instructor-related endpoints
const iCfg: InstructorsConfig = {
    instructorNames: new Set(["Daniel Abadi", "Bahar Asgari"]),
    limit: 10,
    offset: 0,
    sortBy: new SortBy().ascending("name"),
};

// For section-related endpoints
const cfg: SectionsConfig = {
    courseCodes: new Set(["BMGT407"]),
    instructor: "Darryll Pines",
    limit: 10,
    offset: 0,
    sortBy: new SortBy().ascending("course_code").ascending("sec_code"),
};
```

#### Calling the endpoints

The endpoints can be called using the `JupiterpClientV0` class. They return different response types depending on the endpoint.

```ts
import {
    JupiterpClientV0,
    CoursesBasicResponse,
    CoursesMinifiedResponse,
    CoursesResponse,
    SectionsResponse,
    InstructorsResponse
} from '@jupiterp/jupiterp';

const client = JupiterpClientV0.createDefault();

// Health check
const healthRes: Response = await client.health();

// List of basic course info (API path: /v0/courses)
const courseRes: CoursesBasicResponse = await client.courses(coursesConfig);

// List of minified courses (API path: /v0/courses/minified)
const minifiedCourseRes: CoursesMinifiedResponse = await client.courses(coursesConfig);

// List of courses with section data (API path: /v0/courses/withSections)
const coursesWithSecRes: CoursesResponse = await client.coursesWithSections(coursesWithSectionsConfig);

// List of sections (API path: /v0/sections)
const sectionsRes: SectionsResponse = await client.sections(sectionsConfig);

// List of instructors (including inactive) (API path: /v0/instructors)
const instructorsRes: InstructorsResponse = await client.instructors(instructorsConfig);

// List of active instructors (API path: /v0/instructors/active)
const activeInstructorsRes: InstructorsResponse = await client.activeInstructors(instructorsConfig);

// A list of all 4-letter department codes.
public async deptList(): Promise<DepartmentsResponse>;
```

#### Extracting data from a response

Endpoint calls through the `JupiterpClientV0` return an `ApiResponse<T>` where `T` depends on the endpoint.

```ts
class ApiResponse<T> {
    public statusCode: number;
    public statusMessage: string;
    public errorBody?: string;
    public data: T[] | null;

    public ok(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300;
    }
}
```

When using the Jupiterp SDK, you do not directly invoke `ApiResponse<T>`; instead, response types are exported as the following types:

```ts
type CoursesBasicResponse = ApiResponse<CourseBasic>;
type CoursesMinifiedResponse = ApiResponse<CourseMinified>;
type CoursesResponse = ApiResponse<Course>;
type SectionsResponse = ApiResponse<Section>;
type InstructorsResponse = ApiResponse<Instructor>;
type DepartmentsResponse = ApiResponse<Department>;
```

Extracting data can be done like so:

```ts
import {
    JupiterpClientV0,
    SectionsResponse,
    Section
} from '@jupiterp/jupiterp';

const client = JupiterpClientV0.createDefault();
const sectionsRes: SectionsResponse = client.sections(sectionsConfig);
if (sectionsRes.ok()) {
    const sections: Section[] = sectionsRes.data;
}
```

### Exported types

#### API Interactions

##### JupiterpClientV0

```ts
/**
 * A client for interacting with the Jupiterp API v0.
 */
class JupiterpClientV0 {
    readonly dbUrl: string;

    /**
     * Creates a default client that connects to the official Jupiterp API.
     * @returns A new instance of JupiterpClientV0.
     */
    public static createDefault(): JupiterpClientV0;

    /**
     * Get a health check response from the API.
     * @returns A promise that resolves to a simple text message if the API
     * is reachable.
     */
    public async health(): Promise<Response>;

    /**
     * Get a list of courses based on the provided configuration. These are
     * basic course objects without sections information. For courses with
     * sections, use `coursesWithSections`.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course data.
     */
    public async courses(cfg: CoursesConfig): Promise<CoursesBasicResponse>;

    /**
     * Get a list of minified courses.
     */
    public async minifiedCourses(cfg: CoursesConfig): Promise<CoursesMinifiedResponse>;

    /**
     * Get a list of courses along with their sections based on the provided
     * configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the course
     * and section data.
     */
    public async coursesWithSections(cfg: CoursesWithSectionsConfig): Promise<CoursesResponse>;

    /**
     * Get a list of sections based on the provided configuration.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the section data.
     */
    public async sections(cfg: SectionsConfig): Promise<SectionsResponse>;

    /**
     * Get a list of all instructors and their average ratings, including
     * instructors not actively teaching any courses.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    public async instructors(cfg: InstructorsConfig): Promise<InstructorsResponse>;

    /**
     * Get instructors that are currently teaching a course, as listed on Testudo,
     * based on the configuration provided.
     * @param cfg A configuration object specifying filters and options for the
     * request.
     * @returns A promise that resolves to an ApiResponse containing the instructor data.
     */
    public async activeInstructors(cfg: InstructorsConfig): Promise<InstructorsResponse>;

    /**
     * Get grade distributions for individual sections. For almost every
     * purpose you want one of the summary methods instead.
     */
    public async grades(cfg: GradesConfig): Promise<GradesResponse>;

    /**
     * Get grade distributions for courses, summed across every term on record.
     */
    public async courseGrades(cfg: GradeSummaryConfig): Promise<CourseGradeSummaryResponse>;

    /**
     * Get grade distributions for courses, broken out by term.
     */
    public async courseTermGrades(cfg: GradeSummaryConfig): Promise<CourseTermGradeSummaryResponse>;

    /**
     * Get grade distributions broken out by instructor within a course.
     */
    public async courseInstructorGrades(cfg: GradeSummaryConfig): Promise<CourseInstructorGradeSummaryResponse>;

    /**
     * Get one instructor's grades across every course they have taught.
     */
    public async instructorGrades(cfg: GradeSummaryConfig): Promise<InstructorGradeSummaryResponse>;

    /**
     * Get one instructor's grades broken out by term.
     */
    public async instructorTermGrades(cfg: GradeSummaryConfig): Promise<InstructorTermGradeSummaryResponse>;

    /**
     * Get every term for which grade data is available, newest first.
     */
    public async gradeTerms(): Promise<GradeTermsResponse>;

    /**
     * Get approved reviews for an instructor, newest first.
     */
    public async reviews(cfg: ReviewsConfig): Promise<ReviewsResponse>;

    /**
     * Submit a review. Not published until the reviewer confirms by email and
     * a moderator approves it.
     */
    public async submitReview(review: ReviewSubmission): Promise<SubmitReviewResult>;

    /**
     * Confirm a review using the token from its verification email. Returns
     * the management key exactly once.
     */
    public async verifyReview(token: string): Promise<VerifyReviewResult>;

    /**
     * Edit a review using its management key. Returns it to moderation.
     */
    public async editReview(
        id: string,
        manageKey: string,
        changes: Partial<Pick<ReviewSubmission, "rating" | "expectedGrade" | "title" | "body">>
    ): Promise<boolean>;

    /**
     * Withdraw a review using its management key.
     */
    public async withdrawReview(id: string, manageKey: string): Promise<boolean>;

    /**
     * Report a published review for breaching the content policy.
     */
    public async reportReview(id: string, reason: string, detail?: string): Promise<boolean>;
}
```

#### Course and Instructor Data

##### Instructor

```ts
/**
 * An individual instructor.
 *
 * Instructor records originate from UMD's Testudo Schedule of Classes and from
 * the Registrar's historical grade records. Ratings were seeded once from
 * PlanetTerp as a historical baseline and are now accumulated on Jupiterp; see
 * the `pt_*` and `jupiterp_*` fields below.
 */
interface Instructor {
    /**
     * The numeric identifier for this instructor.
     *
     * Stable across name changes and spelling variations, and the value to use
     * when storing a reference to an instructor.
     */
    id: number,

    /**
     * The URL-safe identifier for this instructor, unique to them, used as the
     * professor page path segment on Jupiterp (`/professor/shane-walsh`).
     *
     * **This changed in v1.0.0.** Through v0.8.5 this field held PlanetTerp's
     * slug, in `lastname_firstname` form (`abadi_daniel`). It is now Jupiterp's
     * own, in `first-last` form (`daniel-abadi`). Slugs saved from an earlier
     * version will not match; PlanetTerp's value is preserved in `pt_slug` so
     * that old identifiers can still be mapped across.
     */
    slug: string,

    /**
     * The instructor's name, as displayed.
     */
    name: string,

    /**
     * The instructor's rating out of 5.
     *
     * Retained as a string for compatibility with v0.x, where it was returned
     * as one. Prefer `combined_rating`, which carries the same value as a
     * number.
     *
     * **The meaning of this field changed in v1.0.0.** It was PlanetTerp's
     * average rating; it is now the blend of Jupiterp's own reviews and the
     * PlanetTerp baseline described in `combined_rating`.
     *
     * @deprecated Use `combined_rating`.
     */
    average_rating: string | null,

    /**
     * PlanetTerp's slug for this instructor, if they had one.
     *
     * Frozen at the time of the one-time import and never updated. Present so
     * that identifiers saved before v1.0.0 can be resolved to the current
     * `slug`.
     */
    pt_slug: string | null,

    /**
     * PlanetTerp's average rating for this instructor, out of 5, frozen at
     * `pt_snapshot_at`. Null for instructors PlanetTerp had no record of.
     */
    pt_average_rating: number | null,

    /**
     * How many PlanetTerp reviews produced `pt_average_rating`. Used to weight
     * the baseline: an average over three reviews should not carry the same
     * weight as one over sixty.
     */
    pt_review_count: number | null,

    /**
     * When the PlanetTerp ratings were captured, as an ISO 8601 timestamp.
     *
     * The baseline's contribution to `combined_rating` decays from this point
     * and reaches zero after about six years.
     */
    pt_snapshot_at: string | null,

    /**
     * The average rating from reviews submitted on Jupiterp, out of 5, with
     * more recent reviews weighted more heavily. Null before this instructor
     * has any approved reviews.
     */
    jupiterp_rating: number | null,

    /**
     * How many approved Jupiterp reviews this instructor has.
     */
    jupiterp_review_count: number,

    /**
     * The rating shown on Jupiterp, out of 5: the blend of `jupiterp_rating`
     * and `pt_average_rating`, weighted by recency and review count and shrunk
     * toward the global mean so that an instructor with three reviews does not
     * outrank one with sixty on the strength of a small sample.
     *
     * Null when there is not enough behind it to be worth showing, which is a
     * meaningfully different state from a low rating.
     */
    combined_rating: number | null,

    /**
     * Whether this instructor is teaching at least one section in the current
     * term, according to Testudo.
     */
    is_active: boolean,

    /**
     * The earliest term this instructor is known to have taught in, as a
     * six-digit term code (`202608`). Null if unknown.
     */
    first_seen_term: number | null,

    /**
     * The most recent term this instructor is known to have taught in, as a
     * six-digit term code. Null if unknown.
     */
    last_seen_term: number | null,
}
```

##### Section

```ts
/**
 * A section of a class.
 */
interface Section {
    /**
     * The course code, e.g. "CMSC131".
     */
    courseCode: string;

    /**
     * The section code, e.g. "0101".
     */
    sectionCode: string;

    /**
     * A list of instructors teaching this section.
     */
    instructors: string[];

    /**
     * A list of meetings for this section. A meeting represents a group of
     * class times and locations that this section meets throughout the week.
     * A single meeting can represent multiple days (e.g. MWF 10:00-10:50).
     */
    meetings: ClassMeeting[];

    openSeats: number;
    totalSeats: number;
    waitlist: number;

    /**
     * The number of seats held for special purposes (e.g. departmental
     * holds). This is null if the information is not available.
     */
    holdfile: number | null;
}

export type ClassMeeting =
    | "OnlineAsync"
    | "Unknown"
    | "TBA"
    | "Unspecified"
    | "No Sections"
    | { classtime: Classtime; location: Location; };

/**
 * A time and days when a class meets. The start and end times are represented
 * as the number of hours plus a decimal component representing the number of
 * minutes as a fraction of an hour. For example, 1:30 PM would be represented
 * as 13.5.
 */
export interface Classtime {
    days: string;
    start: number;
    end: number;
}

/**
 * The location at which a class meeting takes place.
 */
export interface Location {
    building: string;
    room: string;
}
```

##### CourseBasic

```ts
/**
 * A course with all course info, but no sections.
 */
interface CourseBasic {
    /**
     * The course code, e.g. "CMSC131".
     */
    courseCode: string;

    /**
     * The name of the course, e.g. "Object-Oriented Programming I".
     */
    name: string;

    /**
     * The minimum number of credits for the course. For most courses, this is
     * the only number of credits available.
     */
    minCredits: number;

    /**
     * The maximum number of credits for the course. This is null if the course
     * only has one credit option. Otherwise, this is the highest number of
     * credits available. For example, a course listed to be 1-3 credits will
     * have a minCredits of 1 and a maxCredits of 3.
     */
    maxCredits: number | null;

    /**
     * A list of gen eds that this course satisfies, or null if none.
     */
    genEds: GenEd[] | null;

    /**
     * A list of special conditions for enrolling in this course, or null
     * if none. Example of conditions include "Prerequisite", "Corequisite",
     * "Credit only granted for", etc.
     */
    conditions: string[] | null;

    /**
     * A description of the course.
     */
    description: string | null;
}
```

##### CourseMinified

```ts
/**
 * A minified course with only the course code and name.
 */
interface CourseMinified {
    /**
     * The course code, e.g. "CMSC131".
     */
    courseCode: string;

    /**
     * The name of the course, e.g. "Object-Oriented Programming I".
     */
    name: string;
}
```

##### Course

```ts
/**
 * A course with all course info, including sections.
 */
interface Course {
    /**
     * The course code, e.g. "CMSC131".
     */
    courseCode: string;

    /**
     * The name of the course, e.g. "Object-Oriented Programming I".
     */
    name: string;

    /**
     * The minimum number of credits for the course. For most courses, this is
     * the only number of credits available.
     */
    minCredits: number;

    /**
     * The maximum number of credits for the course. This is null if the course
     * only has one credit option. Otherwise, this is the highest number of
     * credits available. For example, a course listed to be 1-3 credits will
     * have a minCredits of 1 and a maxCredits of 3.
     */
    maxCredits: number | null;

    /**
     * A list of gen eds that this course satisfies, or null if none.
     */
    genEds: GenEd[] | null;

    /**
     * A list of special conditions for enrolling in this course, or null
     * if none. Example of conditions include "Prerequisite", "Corequisite",
     * "Credit only granted for", etc.
     */
    conditions: string[] | null;

    /**
     * A description of the course.
     */
    description: string | null;

    /**
     * A list of sections for this course, or null if no sections are found.
     */
    sections: Section[] | null;
}
```

##### Department

```ts
/**
 * A department
 */
export interface Department {
    deptCode: string;
    name: string;
}
```

#### Grade Data

```ts
/**
 * Grade distributions from the University of Maryland's Office of the
 * Registrar, obtained through a public records request.
 *
 * Two limitations apply to everything in this file and are worth surfacing to
 * anyone reading these numbers:
 *
 * - **Fall and Spring terms only**, from 2010 onward. Winter and Summer are
 *   not included, so an instructor who teaches only in the summer has no grade
 *   data at all rather than a low number.
 * - **About a quarter of sections carry no instructor** in the source records.
 *   Where a section clearly belongs to a named lecture the attribution is
 *   carried across; where it does not, the section is left unattributed. An
 *   instructor's totals may therefore not cover everything they taught.
 */

/**
 * The fifteen grade buckets, exactly as the Registrar reported them.
 */
interface GradeCounts {
    a_plus: number,
    a: number,
    a_minus: number,
    b_plus: number,
    b: number,
    b_minus: number,
    c_plus: number,
    c: number,
    c_minus: number,
    d_plus: number,
    d: number,
    d_minus: number,
    f: number,
    w: number,
    other: number,
}

/**
 * A grade distribution, summed over some grouping of sections.
 *
 * There are two denominators here and they are not interchangeable:
 *
 * - `graded` counts students who received a letter grade, A+ through F. This
 *   is the GPA denominator, and **withdrawals are not in it** — matching how a
 *   transcript GPA is computed.
 * - `total` is enrollment as reported. Before Fall 2017 it can exceed the sum
 *   of the fifteen buckets, because the older reports left some outcomes
 *   uncategorized. It is therefore not comparable across eras and should not
 *   be used as a percentage denominator.
 *
 * For a distribution bar chart where the segments should sum to 100% with
 * withdrawals visible, use `graded + w`.
 */
interface GradeSummary extends GradeCounts {
    /**
     * Enrollment as reported. See the note above before dividing by this.
     */
    total: number,

    /**
     * Students who received a letter grade. The GPA denominator; excludes
     * withdrawals.
     */
    graded: number,

    /**
     * Average GPA on the UMD 4.0 scale, or null when nobody in the grouping
     * received a letter grade.
     *
     * A GPA computed from very few students is noise. Consider not displaying
     * one below roughly 20 graded students, or use the `minStudents` option on
     * the request to exclude them.
     */
    gpa: number | null,

    /**
     * How many sections this distribution sums over.
     */
    section_count: number,
}

/**
 * One course, summed across every term on record.
 * Returned by `gradeSummary` with `groupBy: "course"`.
 */
interface CourseGradeSummary extends GradeSummary {
    course_code: string,
    term_count: number,
    first_term: number,
    last_term: number,
}

/**
 * One course in one term.
 * Returned by `gradeSummary` with `groupBy: "term"`.
 */
interface CourseTermGradeSummary extends GradeSummary {
    course_code: string,
    term: number,
}

/**
 * One instructor's grades within one course.
 * Returned by `gradeSummary` with `groupBy: "instructor"`.
 */
interface CourseInstructorGradeSummary extends GradeSummary {
    course_code: string,
    instructor_id: number,
    instructor: string,
    instructor_slug: string,
    term_count: number,
    first_term: number,
    last_term: number,
}

/**
 * One instructor, summed across every course they have taught.
 * Returned by `gradeSummary` with `groupBy: "instructorOverall"`.
 */
interface InstructorGradeSummary extends GradeSummary {
    instructor_id: number,
    instructor: string,
    instructor_slug: string,
    course_count: number,
    term_count: number,
    first_term: number,
    last_term: number,
}

/**
 * One instructor in one term.
 * Returned by `gradeSummary` with `groupBy: "instructorTerm"`.
 */
interface InstructorTermGradeSummary extends GradeSummary {
    instructor_id: number,
    instructor: string,
    instructor_slug: string,
    term: number,
    course_count: number,
}

/**
 * A single section's grade distribution, as returned by `grades`.
 */
interface SectionGrades extends GradeCounts {
    /**
     * Six-digit term code: the year followed by the month the term begins,
     * so `202608` is Fall 2026 and `202601` is Spring 2026.
     */
    term: number,
    course_code: string,
    sec_code: string,

    /**
     * The instructor exactly as the Registrar printed them, in
     * "Last, First Middle" order. Null where the export named nobody.
     * This is the audit trail rather than the value to display.
     */
    instructor: string | null,

    /**
     * The effective instructor in "First Middle Last" order. May be carried
     * from another section of the same course; check `instructor_source`
     * before relying on it.
     */
    instructor_name: string | null,

    /**
     * The resolved instructor, or null where the name could not be matched to
     * one confidently. Join on this rather than on the name strings.
     */
    instructor_id: number | null,

    /**
     * How `instructor_name` was arrived at, in descending order of confidence:
     *
     * - `reported` — named on this row by the Registrar.
     * - `testudo` — taken from Testudo's schedule for this exact section, where
     *   the Registrar left it blank. Testudo lists the *scheduled* instructor,
     *   who is not always who taught or graded the course.
     * - `lead` — carried from the lead section of the same lecture group, i.e.
     *   the discussion and lab sections of a lecture.
     * - `course` — carried from elsewhere in the course. Demonstrably wrong
     *   sometimes, and excluded from the default aggregates.
     * - `null` — no section of the course was ever named.
     */
    instructor_source: "reported" | "testudo" | "lead" | "course" | null,

    total: number,
    graded: number,
    gpa: number | null,
}

/**
 * One term for which grade data exists, as returned by `gradeTerms`.
 */
interface GradeTerm {
    term: number,
    section_count: number,
    course_count: number,
    total: number,
    graded: number,
    gpa: number | null,
}

/**
 * How to group the results of a `gradeSummary` request.
 *
 * `instructorOverall` and `instructorTerm` aggregate across every course, so
 * they take no course filter — passing one returns a 400 rather than silently
 * ignoring it.
 */
type GradeGroupBy =
    | "course"
    | "term"
    | "instructor"
    | "instructorOverall"
    | "instructorTerm";
```

#### Review Data

```ts
/**
 * Student reviews of instructors, submitted on Jupiterp.
 *
 * Reviews are pre-moderated: nothing submitted is publicly readable until a
 * moderator approves it, so `reviews()` only ever returns approved content.
 * The submitter's identity is never exposed — the API stores only an
 * irreversible hash of their email address, and it is not part of this type.
 */

/**
 * A published review.
 */
interface Review {
    id: string,

    instructor_id: number,
    instructor_slug: string,

    /**
     * The course being reviewed, or null for a review of the instructor
     * generally rather than of one course.
     */
    course_code: string | null,

    /**
     * Six-digit term code, or null if the reviewer did not say.
     */
    term: number | null,

    /**
     * The rating, from 1 to 5 **in half steps**: 1, 1.5, 2, and so on.
     *
     * A decimal, never an integer — a client that types this as an int will
     * silently truncate half the possible values.
     */
    rating: number,

    /**
     * The grade the reviewer said they got or expected. One of the letter
     * grades, `W`, or `Other`. Null if they did not say.
     */
    expected_grade: string | null,

    title: string | null,
    body: string | null,

    submitted_at: string,
    edited_at: string | null,
}

/**
 * A review to submit through `submitReview`.
 */
interface ReviewSubmission {
    /**
     * The instructor being reviewed, by their Jupiterp slug.
     */
    instructorSlug: string,

    /**
     * The course, if the review is about one. Four letters and three digits,
     * optionally with a trailing letter: `CMSC132`, `MATH140`.
     */
    courseCode?: string,

    /**
     * The term the reviewer took the course, as a six-digit term code.
     *
     * Must be a Fall (`YYYY08`) or Spring (`YYYY01`) term: the API rejects
     * Winter and Summer, because the rest of Jupiterp's data covers only those
     * two and a review against a term nothing else can represent is not useful.
     */
    term?: number,

    /**
     * 1 to 5 in half steps. `4.5` is valid; `4.3` is rejected.
     */
    rating: number,

    expectedGrade?: string,

    /**
     * At most 120 characters.
     */
    title?: string,

    /**
     * At most 5000 characters.
     */
    body?: string,

    /**
     * A `terpmail.umd.edu` or `umd.edu` address.
     *
     * Used once to confirm the reviewer is at UMD and to prevent duplicate
     * reviews of the same course. The API stores only an irreversible hash of
     * it and never displays it. A confirmation link is emailed to this address
     * and the review is not submitted until it is clicked.
     */
    email: string,

    /**
     * A Cloudflare Turnstile token. Required by the public API.
     */
    captchaToken?: string,
}

/**
 * The result of a submission.
 *
 * Note that this is deliberately uninformative about whether the address had
 * already reviewed this instructor: the API answers identically either way,
 * because a distinguishable response would let anyone use the endpoint to
 * find out whether a particular person reviewed a particular professor.
 */
interface SubmitReviewResult {
    ok: boolean,

    /**
     * A message suitable for showing to the person who submitted. Present on
     * failure only.
     */
    error?: string,

    /**
     * True when the caller was rate limited and should wait rather than change
     * anything about the request.
     */
    rateLimited?: boolean,
}

/**
 * The result of confirming an emailed verification link.
 */
interface VerifyReviewResult {
    ok: boolean,

    /**
     * The key that lets the reviewer edit or withdraw this review later,
     * returned exactly once.
     *
     * There is deliberately nothing linking it back to a person, so it cannot
     * be recovered. Show it to the reviewer and tell them to keep it.
     */
    manageKey?: string,

    message: string,
}
```

#### Request Configs

##### CoursesConfig

```ts
/**
 * Configuration for a request to any of the courses endpoints.
 */
interface CoursesConfig {
    /**
     * A set of course codes to get results for. Course codes are the
     * department code followed by the course number, e.g. "CMSC131".
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all courses with a course code starting with "CMSC".
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    prefix?: string;

    /**
     * A specific course number to filter courses by. For instance, setting
     * this to "131" will return all courses with a course number of 131,
     * regardless of department.
     * 
     * Note: This is different from the `prefix` field, which filters by
     * department code.
     * 
     * Cannot set more than one of courseCodes, prefix, or number.
     */
    number?: string;

    /**
     * A set of gen eds to filter courses by. If multiple GenEds are provided,
     * the results will be courses that require *all* of the provided GenEds.
     */
    genEds?: Set<GenEd>;

    /**
     * Equalities and inequalities to filter courses by their number of credits.
     */
    creditFilters?: CreditFilter;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}
```

##### CoursesWithSectionsConfig

```ts
/**
 * Configuration for a request to courses-with-sections endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `number?: string`
 * - `genEds?: Set<GenEd>`
 * - `creditFilters?: CreditFilter`
 * - `totalClassSize?: TotalClassSizeFilter`
 * - `onlyOpen?: boolean`
 * - `instructor?: string`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface CoursesWithSectionsConfig extends CoursesConfig {
    /**
     * Filter sections by total class size (capacity).
     */
    totalClassSize?: TotalClassSizeFilter;

    /**
     * If true, only return sections with more then 0 open seats.
     */
    onlyOpen?: boolean;

    /**
     * Only return sections taught by this instructor (full name, case-sensitive).
     */
    instructor?: string;
}
```

##### InstructorsConfig

```ts
interface InstructorsConfig {
    /**
     * A set of instructor names to get results for. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorNames?: Set<string>;

    /**
     * A set of instructor slugs to get results for. Slugs are the identifier
     * used in professor page URLs and are unique to each instructor. Cannot
     * set both instructorNames and instructorSlugs.
     *
     * **Slug format changed in v1.0.0.** These are now Jupiterp's own slugs
     * (`daniel-abadi`), not PlanetTerp's (`abadi_daniel`). Slugs stored by an
     * earlier version of this library will not match anything.
     */
    instructorSlugs?: Set<string>;

    /**
     * A partial name to search for, matched case-insensitively anywhere in the
     * instructor's name.
     *
     * Accents and punctuation are ignored on both sides, so "obrien" finds
     * "O'Brien" and "jose" finds "José". This is the way to find an instructor
     * by partial name; the alternative is downloading every instructor and
     * filtering client-side, which does not scale.
     */
    nameSearch?: string;

    /**
     * If true, return only instructors teaching at least one section in the
     * current term.
     */
    activeOnly?: boolean;

    /**
     * If true, the total number of matching instructors is returned in
     * `ApiResponse.total`, regardless of how many this page contains.
     *
     * Costs an extra aggregate over the filtered set on the server, so it is
     * off by default. Set it when you need to render "1-50 of 4,812" or know
     * how many pages exist.
     */
    count?: boolean;

    /**
     * Equalities and inequalities to filter instructors by their rating.
     */
    ratings?: RatingFilter;

    /**
     * The number of results to return. Defaults to 100, maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}
```

##### SectionsConfig

```ts
/**
 * Configuration for a request to sections endpoints.
 * 
 * Fields:
 * - `courseCodes?: Set<string>`
 * - `prefix?: string`
 * - `totalClassSize?: TotalClassSizeFilter`
 * - `onlyOpen?: boolean`
 * - `instructor?: string`
 * - `limit?: number`
 * - `offset?: number`
 * - `sortBy?: SortBy`
 */
export interface SectionsConfig {
    /**
     * A set of course codes to get results for. Cannot set both
     * courseCodes and prefix.
     */
    courseCodes?: Set<string>;

    /**
     * A prefix to filter course codes by. For instance, setting this to "CMSC"
     * will return all sections with a course code starting with "CMSC".
     * Cannot set both courseCodes and prefix.
     */
    prefix?: string;

    /**
     * Filter sections by total class size (capacity).
     */
    totalClassSize?: TotalClassSizeFilter;

    /**
     * If true, only return sections with more then 0 open seats.
     */
    onlyOpen?: boolean;

    /**
     * Only return sections taught by this instructor (full name, case-sensitive).
     */
    instructor?: string;

    /**
     * Maximum number of section records to return; defaults to 100, 
     * maximum of 500.
     */
    limit?: number;

    /**
     * How many records to skip when returning results; defaults to 0
     */
    offset?: number;

    /**
     * Columns to sort by when returning.
     */
    sortBy?: SortBy;
}
```

#### Request Responses

##### ApiResponse

```ts
/**
 * A generic API response wrapper that includes status information and the data
 * returned by the API.
 */
class ApiResponse<T> {
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

    /**
     * The total number of records matching the request, ignoring paging.
     *
     * Null unless the request asked for it by setting `count: true`, since
     * counting costs the server an extra aggregate. Use it to render
     * "1-50 of 4,812" or to know how many pages exist.
     */
    public total: number | null;

    constructor(statusCode: number, statusMessage: string,
                data: T[] | null, errorBody?: string,
                total?: number | null);

    /**
     * Checks if the response was successful.
     * @returns True if the response status code indicates success (2xx), false otherwise.
     */
    public ok(): boolean;
}
```

##### Response Type Wrappers

```ts
/**
 * A response to a basic courses request (no sections information).
 */
type CoursesBasicResponse = ApiResponse<CourseBasic>;

/**
 * A response to a minified courses request.
 */
type CoursesMinifiedResponse = ApiResponse<CourseMinified>;

/**
 * A response to a full courses request (with sections information).
 */
type CoursesResponse = ApiResponse<Course>;

/**
 * A response to a sections request.
 */
type SectionsResponse = ApiResponse<Section>;

/**
 * A response to an instructor request.
 */
type InstructorsResponse = ApiResponse<Instructor>;
```

#### Miscellaneous

##### SortBy

```ts
/**
 * Class to build sortBy query parameters for API requests.
 * Sorting is done in the order that the keys are added.
 * ```ts
 * const sortBy =
 *   new SortBy()
 *     .ascending("name")
 *     .descending("min_credits");
 * ```
 */
class SortBy {
    sortKeys: string[] = [];

    constructor() {}

    public ascending(key: string): this;
    public descending(key: string): this;
    public argsArray(): string[];
    public length(): number;
}
```

##### CreditFilter

```ts
/**
 * A filter for the number of credits in a course. Can be used in a 
 * `CoursesConfig`.
 * ```ts
 * const creditFilter = 
 *  new CreditFilter().greaterThanOrEqualTo(2).lessThanOrEqualTo(4);
 * ```
 * This does not enforce that the filters make sense to be used together. For
 * instance, it is possible to create this:
 * ```ts
 * const creditFilter = 
 *  new CreditFilter().equalTo(3).notEqualTo(3);
 * ```
 * which will never return any results.
 */
class CreditFilter {
    filtersParams: string[] = [];

    constructor(columnName: string);

    public argsArray(): string[];
    public equalTo(value: number): this;
    public lessThanOrEqualTo(value: number): this;
    public greaterThanOrEqualTo(value: number): this;
    public lessThan(value: number): this;
    public greaterThan(value: number): this;
    public notEqualTo(value: number): this;
}
```

##### RatingFilter

```ts
/**
 * A filter for the average rating of an instructor. Can be used in an `InstructorsConfig`.
 * ```ts
 * const ratingFilter = new RatingFilter().greaterThanOrEqualTo(4.0).lessThan(5.0);
 * ```
 * This does not enforce that the filters make sense to be used together. For
 * instance, it is possible to create this:
 * ```ts
 * const ratingFilter = 
 *  new RatingFilter().equalTo(3).notEqualTo(3);
 * ```
 * which will never return any results.
 */
class RatingFilter {
    filtersParams: string[] = [];

    constructor(columnName: string);

    public argsArray(): string[];
    public equalTo(value: number): this;
    public lessThanOrEqualTo(value: number): this;
    public greaterThanOrEqualTo(value: number): this;
    public lessThan(value: number): this;
    public greaterThan(value: number): this;
    public notEqualTo(value: number): this;
}
```

##### GenEd

```ts
/**
 * A GenEd (General Education) requirement at UMD as listed on Testudo.
 * GenEds are currently hard-coded, so it is possible that they are not
 * up-to-date. If they are not, please contact the maintainer of this library.
 * 
 * GenEds are static and can be accessed and used like so:
 * ```ts
 * const genEd = GenEd.FSAW; // Academic Writing
 * console.log(genEd.code); // "FSAW"
 * console.log(genEd.name); // "Academic Writing"
 * ```
 */
class GenEd {
    code: string;
    name: string;

    public static FSAW = new GenEd("FSAW", "Academic Writing");
    public static FSAR = new GenEd("FSAR", "Analytic Reasoning")
    public static FSMA = new GenEd("FSMA", "Math");
    public static FSOC = new GenEd("FSOC", "Oral Communications");
    public static FSPW = new GenEd("FSPW", "Professional Writing");

    public static DSHS = new GenEd("DSHS", "History and Social Sciences")
    public static DSHU = new GenEd("DSHU", "Humanities")
    public static DSNS = new GenEd("DSNS", "Natural Sciences")
    public static DSNL = new GenEd("DSNL", "Natural Science Lab")
    public static DSSP = new GenEd("DSSP", "Scholarship in Practice")

    public static DVCC = new GenEd("DVCC", "Cultural Competency")
    public static DVUP = new GenEd("DVUP", "Understanding Plural Societies")

    public static SCIS = new GenEd("SCIS", "Signature Courses - Big Question")

    public static fromCode(code: string): GenEd;
}
```