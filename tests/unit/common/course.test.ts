import { GenEd } from "../../../src";
import { CourseBasic, CourseBasicRaw, parseRawCourseBasic } from "../../../src/common/course";

describe("course data conversion", () => {
    test("converts CourseBasicRaw to CourseBasic correctly", () => {
        const raw: CourseBasicRaw = {
            course_code: "CMSC131",
            name: "Object-Oriented Programming I",
            min_credits: 3,
            max_credits: null,
            gen_eds: ["DVUP"],
            conditions: ["Prerequisite: CMSC132"],
            description: "An introduction to object-oriented programming using Java.",
        }

        const parsed: CourseBasic = parseRawCourseBasic(raw);

        expect(parsed).toEqual({
            courseCode: "CMSC131",
            name: "Object-Oriented Programming I",
            minCredits: 3,
            maxCredits: null,
            genEds: [GenEd.DVUP],
            conditions: ["Prerequisite: CMSC132"],
            description: "An introduction to object-oriented programming using Java.",
        });
    });
});