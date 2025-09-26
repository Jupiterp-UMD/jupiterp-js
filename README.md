# Jupiterp SDK

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

// For all course-related endpoints
const cCfg: CoursesConfig = {
    courseCodes: new Set(["CMSC131", "MATH140"]),
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
const coursesWithSecRes: CoursesResponse = await client.coursesWithSections(coursesConfig);

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
type DepartmentsResponse = ApiResponse<string>;
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
    public async coursesWithSections(cfg: CoursesConfig): Promise<CoursesResponse>;

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
}
```

#### Course and Instructor Data

##### Instructor

```ts
/**
 * An individual instructor; contains their slug (unique id on PlanetTerp),
 * name, and average rating out of 5.
 */
interface Instructor {
    /**
     * The internal string used to identify an individual instructor, unique
     * to that instructor. See PlanetTerp API spec for more info.
     */
    slug: string,

    /**
     * The instructor's name as listed on PlanetTerp
     */
    name: string,

    /**
     * The average rating given to that professor from reviews on PlanetTerp
     */
    average_rating: string | null,
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

##### InstructorsConfig

```ts
/**
 * Configuration for a request to instructors endpoints.
 */
interface InstructorsConfig {
    /**
     * A set of instructor names to get results for. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorNames?: Set<string>;

    /**
     * A set of instructor slugs to get results for. Slugs are the internal
     * identifier used to distinguish an instructor and are unique to each
     * instructor. See PlanetTerp API spec for more info. Cannot set both
     * instructorNames and instructorSlugs.
     */
    instructorSlugs?: Set<string>;

    /**
     * Equalities and inequalities to filter instructors by their average
     * rating on PlanetTerp.
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
 */
interface SectionsConfig {
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
     * The data returned by the API, or null if there was an error.
     */
    public data: T[] | null;

    constructor(statusCode: number, statusMessage: string,
                data: T[] | null, errorBody?: string);

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