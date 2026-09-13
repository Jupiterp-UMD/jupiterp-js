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
export interface Review {
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
export interface ReviewSubmission {
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
export interface SubmitReviewResult {
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
export interface VerifyReviewResult {
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
