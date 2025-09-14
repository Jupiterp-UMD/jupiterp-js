import { GenEd } from "./course-traits";
import { parseRawSection, Section, SectionRaw } from "./section";

export interface CourseBasicRaw {
    course_code: string;
    name: string;
    min_credits: number;
    max_credits: number | null;
    gen_eds: string[] | null;
    conditions: string[] | null;
    description: string | null;
}

/**
 * A course with all course info, but no sections.
 */
export interface CourseBasic {
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

export function parseRawCourseBasic(raw: CourseBasicRaw): CourseBasic {
    return {
        courseCode: raw.course_code,
        name: raw.name,
        minCredits: raw.min_credits,
        maxCredits: raw.max_credits,
        genEds: raw.gen_eds ? raw.gen_eds.map(GenEd.fromCode) : null,
        conditions: raw.conditions,
        description: raw.description,
    }
}

/**
 * A minified course object with only the course code and name.
 */
export interface CourseMinifiedRaw {
    course_code: string;
    name: string;
}

export interface CourseMinified {
    /**
     * The course code, e.g. "CMSC131".
     */
    courseCode: string;

    /**
     * The name of the course, e.g. "Object-Oriented Programming I".
     */
    name: string;
}

export function parseRawCourseMinified(raw: CourseMinifiedRaw): CourseMinified {
    return {
        courseCode: raw.course_code,
        name: raw.name,
    }
}

/**
 * A course with all course info, including sections.
 */
export interface CourseRaw {
    course_code: string;
    name: string;
    min_credits: number;
    max_credits: number | null;
    gen_eds: string[] | null;
    conditions: string[] | null;
    description: string | null;
    sections: SectionRaw[] | null;
}

export interface Course {
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

export function parseRawCourse(raw: CourseRaw): Course {
    return {
        courseCode: raw.course_code,
        name: raw.name,
        minCredits: raw.min_credits,
        maxCredits: raw.max_credits,
        genEds: raw.gen_eds ? raw.gen_eds.map(GenEd.fromCode) : null,
        conditions: raw.conditions,
        description: raw.description,
        sections: raw.sections ? raw.sections.map(parseRawSection) : null,
    }
}