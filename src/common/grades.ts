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
export interface GradeCounts {
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
export interface GradeSummary extends GradeCounts {
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
export interface CourseGradeSummary extends GradeSummary {
    course_code: string,
    term_count: number,
    first_term: number,
    last_term: number,
}

/**
 * One course in one term.
 * Returned by `gradeSummary` with `groupBy: "term"`.
 */
export interface CourseTermGradeSummary extends GradeSummary {
    course_code: string,
    term: number,
}

/**
 * One instructor's grades within one course.
 * Returned by `gradeSummary` with `groupBy: "instructor"`.
 */
export interface CourseInstructorGradeSummary extends GradeSummary {
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
export interface InstructorGradeSummary extends GradeSummary {
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
export interface InstructorTermGradeSummary extends GradeSummary {
    instructor_id: number,
    instructor: string,
    instructor_slug: string,
    term: number,
    course_count: number,
}

/**
 * A single section's grade distribution, as returned by `grades`.
 */
export interface SectionGrades extends GradeCounts {
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
export interface GradeTerm {
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
export type GradeGroupBy =
    | "course"
    | "term"
    | "instructor"
    | "instructorOverall"
    | "instructorTerm";
