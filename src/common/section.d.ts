/**
 * Represents a section of a course as returned by the Jupiterp API,
 * before additional processing to convert to more idiomatic and useful
 * structures.
 */
export interface SectionRaw {
    course_code: string;
    sec_code: string;
    instructors: string[];
    meetings: string[];
    open_seats: number;
    total_seats: number;
    waitlist: number;
    holdfile: number | null;
}
/**
 * A section of a class.
 */
export interface Section {
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
export type ClassMeeting = "OnlineAsync" | "Unknown" | "TBA" | {
    classtime: Classtime | null;
    location: Location | null;
};
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
/**
 * Converts a SectionRaw object to a Section object.
 * @param raw Raw section data from the API.
 * @returns A parsed Section object.
 */
export declare function parseRawSection(raw: SectionRaw): Section;
//# sourceMappingURL=section.d.ts.map