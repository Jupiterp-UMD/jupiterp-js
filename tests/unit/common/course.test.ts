import { GenEd } from "../../../src";
import { Course, CourseBasic, CourseBasicRaw, CourseRaw, parseRawCourse, parseRawCourseBasic } from "../../../src/common/course";

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

    test("converts CourseRaw to Course with Sections correctly", () => {
        const raw: CourseRaw = {
            course_code: "CMSC433",
            name: "Programming Language Technologies and Paradigms",
            min_credits: 3,
            max_credits: null,
            gen_eds: null,
            conditions: [
                "Prerequisite: Minimum grade of C- in CMSC330; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program. ",
                "Restriction: Permission of CMNS-Computer Science department."
            ],
            description: "Programming language technologies (e.g., object-oriented programming), their implementations and use in software design and implementation.",
            sections: [
                {
                    holdfile: null,
                    meetings: [
                    "TuTh-11:00am-12:15pm-CSI-1115"
                    ],
                    sec_code: "0101",
                    waitlist: 0,
                    open_seats: 0,
                    course_code: "CMSC433",
                    instructors: [
                    "Anwar Mamat"
                    ],
                    total_seats: 145
                }
            ]
        };
        const expected: Course = {
            courseCode: "CMSC433",
            name: "Programming Language Technologies and Paradigms",
            minCredits: 3,
            maxCredits: null,
            genEds: null,
            conditions: [
                "Prerequisite: Minimum grade of C- in CMSC330; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program. ",
                "Restriction: Permission of CMNS-Computer Science department."
            ],
            description: "Programming language technologies (e.g., object-oriented programming), their implementations and use in software design and implementation.",
            sections: [
                {
                    courseCode: "CMSC433",
                    sectionCode: "0101",
                    totalSeats: 145,
                    openSeats: 0,
                    waitlist: 0,
                    holdfile: null,
                    instructors: [
                        "Anwar Mamat"
                    ],
                    meetings: [
                        {
                            classtime: {
                                days: "TuTh",
                                start: 11.0,
                                end: 12.25,
                            },
                            location: {
                                building: "CSI",
                                room: "1115",
                            }
                        }
                    ],
                }
            ]
        };

        const parsed: Course = parseRawCourse(raw);

        expect(parsed).toStrictEqual(expected);
    });
});