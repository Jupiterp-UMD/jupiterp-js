/**
 * An individual instructor; contains their slug (unique id on PlanetTerp),
 * name, and average rating out of 5.
 */
export interface Instructor {
    /**
     * The internal string used to identify an individual instructor, unique
     * to that instructor. See PlanetTerp API spec for more info.
     */
    slug: string;
    /**
     * The instructor's name as listed on PlanetTerp
     */
    name: string;
    /**
     * The average rating given to that professor from reviews on PlanetTerp
     */
    average_rating: string | null;
}
//# sourceMappingURL=instructor.d.ts.map