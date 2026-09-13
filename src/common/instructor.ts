/**
 * An individual instructor.
 *
 * Instructor records originate from UMD's Testudo Schedule of Classes and from
 * the Registrar's historical grade records. Ratings were seeded once from
 * PlanetTerp as a historical baseline and are now accumulated on Jupiterp; see
 * the `pt_*` and `jupiterp_*` fields below.
 */
export interface Instructor {
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
     * Typed as a number, because that is what the API sends. This was declared
     * `string | null` on the belief that v0 returned it as one; it never did.
     * `instructors.average_rating` is a Postgres `real` and always has been --
     * see migration 0020, which fixed a cast that assumed otherwise -- so
     * PostgREST serialises it as a JSON number and every consumer written
     * against the string type was wrong. `parseFloat` coerced it and hid the
     * mismatch; any actual string method on it would have thrown.
     *
     * **The meaning of this field changed in v1.0.0.** It was PlanetTerp's
     * average rating; it is now the blend of Jupiterp's own reviews and the
     * PlanetTerp baseline described in `combined_rating`.
     *
     * @deprecated Use `combined_rating`, which is the same value under a name
     * that says what it is.
     */
    average_rating: number | null,

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
