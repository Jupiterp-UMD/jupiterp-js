import {
    SectionRaw, Section, ClassMeeting, Classtime, Location, parseRawSection
} from "../../../src/common/section";

describe("section data conversion", () => {
    test("converts OnlineAsync SectionRaw to Section correctly", () => {
        const raw: SectionRaw = {
            course_code: "CMSC131",
            sec_code: "0101",
            instructors: ["John Doe"],
            meetings: ["OnlineAsync"],
            open_seats: 5,
            total_seats: 30,
            waitlist: 0,
            holdfile: null,
        }

        const parsed: Section = parseRawSection(raw);
        expect(parsed).toEqual({
            courseCode: "CMSC131",
            sectionCode: "0101",
            instructors: ["John Doe"],
            meetings: ["OnlineAsync"],
            openSeats: 5,
            totalSeats: 30,
            waitlist: 0,
            holdfile: null,
        });
    });

    test("converts TBA SectionRaw to Section correctly", () => {
        const raw: SectionRaw = {
            course_code: "CMSC131",
            sec_code: "0101",
            instructors: ["John Doe", "Jane Smith"],
            meetings: ["TBA"],
            open_seats: 5,
            total_seats: 30,
            waitlist: 20,
            holdfile: 3,
        }

        const parsed: Section = parseRawSection(raw);
        expect(parsed).toEqual({
            courseCode: "CMSC131",
            sectionCode: "0101",
            instructors: ["John Doe", "Jane Smith"],
            meetings: ["TBA"],
            openSeats: 5,
            totalSeats: 30,
            waitlist: 20,
            holdfile: 3,
        });
    });

    test("converts Unknown SectionRaw to Section correctly", () => {
        const raw: SectionRaw = {
            course_code: "BMGT298M",
            sec_code: "0101",
            instructors: ["Testudo Testudo"],
            meetings: ["Unknown"],
            open_seats: 0,
            total_seats: 0,
            waitlist: 0,
            holdfile: null,
        }

        const parsed: Section = parseRawSection(raw);
        expect(parsed).toEqual({
            courseCode: "BMGT298M",
            sectionCode: "0101",
            instructors: ["Testudo Testudo"],
            meetings: ["Unknown"],
            openSeats: 0,
            totalSeats: 0,
            waitlist: 0,
            holdfile: null,
        });
    });
    
    test("converts regular SectionRaw to Section correctly", () => {
        const raw: SectionRaw = {
            course_code: "ASTR320",
            sec_code: "F010",
            instructors: ["Alice Johnson"],
            meetings: [
                "MWF-10:00am-10:45am-ESJ-0101",
                "T-2:00pm-4:00pm-OnlineSync"
            ],
            open_seats: 2,
            total_seats: 20,
            waitlist: 5,
            holdfile: null,
        }

        const parsed: Section = parseRawSection(raw);
        expect(parsed).toEqual({
            courseCode: "ASTR320",
            sectionCode: "F010",
            instructors: ["Alice Johnson"],
            meetings: [
                {
                    classtime: { days: "MWF", start: 10, end: 10.75 },
                    location: { building: "ESJ", room: "0101" }
                },
                {
                    classtime: { days: "T", start: 14, end: 16 },
                    location: { building: "OnlineSync", room: "" }
                }
            ],
            openSeats: 2,
            totalSeats: 20,
            waitlist: 5,
            holdfile: null,
        });
    })
});