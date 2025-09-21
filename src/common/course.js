import { GenEd } from "./course-traits";
import { parseRawSection } from "./section";
export function parseRawCourseBasic(raw) {
    return {
        courseCode: raw.course_code,
        name: raw.name,
        minCredits: raw.min_credits,
        maxCredits: raw.max_credits,
        genEds: raw.gen_eds ? raw.gen_eds.map(GenEd.fromCode) : null,
        conditions: raw.conditions,
        description: raw.description,
    };
}
export function parseRawCourseMinified(raw) {
    return {
        courseCode: raw.course_code,
        name: raw.name,
    };
}
export function parseRawCourse(raw) {
    return {
        courseCode: raw.course_code,
        name: raw.name,
        minCredits: raw.min_credits,
        maxCredits: raw.max_credits,
        genEds: raw.gen_eds ? raw.gen_eds.map(GenEd.fromCode) : null,
        conditions: raw.conditions,
        description: raw.description,
        sections: raw.sections ? raw.sections.map(parseRawSection) : null,
    };
}
