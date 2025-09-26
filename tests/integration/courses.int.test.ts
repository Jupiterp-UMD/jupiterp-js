import {
    JupiterpClientV0, 
    CoursesBasicResponse, 
    CoursesConfig, 
    SortBy,
    GenEd,
    CoursesResponse,
    CoursesMinifiedResponse
} from "../../src";

describe("courses endpoints integration tests", () => {
    it("fetches basic course info by course codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: CoursesConfig = {
            courseCodes: new Set(["CMSC131", "MATH140"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code"),
        };

        const resp: CoursesBasicResponse = await client.courses(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            expect(resp.data[0].courseCode).toBe("CMSC131");
            expect(resp.data[0].name).toBe("Object-Oriented Programming I");
            expect(resp.data[0].minCredits).toBe(4);
            expect(resp.data[0].maxCredits).toBeNull();
            expect(resp.data[0].description).toBe("Introduction to programming and computer science. Emphasizes understanding and implementation of applications using object-oriented techniques. Develops skills such as program design and testing as well as implementation of programs using a graphical IDE. Programming done in Java.");
            expect(resp.data[0].genEds).toBeNull();
            expect(resp.data[0].conditions).toEqual(["Corequisite: MATH140. ", "Credit only granted for: CMSC131, CMSC133 or CMSC141."]);

            expect(resp.data[1].courseCode).toBe("MATH140");
            expect(resp.data[1].name).toBe("Calculus I");
            expect(resp.data[1].minCredits).toBe(4);
            expect(resp.data[1].maxCredits).toBeNull();
            expect(resp.data[1].description).toBe("Introduction to calculus, including functions, limits, continuity, derivatives and applications of the derivative, sketching of graphs of functions, definite and indefinite integrals, and calculation of area. The course is especially recommended for science, engineering and mathematics majors.");
            expect(resp.data[1].genEds?.length).toBe(2);
            expect(resp.data[1].genEds).toContain(GenEd.FSMA);
            expect(resp.data[1].genEds).toContain(GenEd.FSAR);
            expect(resp.data[1].conditions).toStrictEqual(["Prerequisite: Minimum grade of C- in MATH115."]);
        }
    });

    it("fetches minified course info by course codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: CoursesConfig = {
            courseCodes: new Set(["CMSC131", "MATH140"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code"),
        };

        const resp: CoursesMinifiedResponse = await client.minifiedCourses(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data).toStrictEqual([
                { courseCode: "CMSC131", name: "Object-Oriented Programming I" },
                { courseCode: "MATH140", name: "Calculus I" },
            ]);
        }
    });

    it("fetches full course info with sections by course codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: CoursesConfig = {
            courseCodes: new Set(["CMSC433"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code"),
        };

        const resp: CoursesResponse = await client.coursesWithSections(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(1);
            expect(resp.data[0].courseCode).toBe("CMSC433");
            expect(resp.data[0].name).toBe("Programming Language Technologies and Paradigms");
            expect(resp.data[0].minCredits).toBe(3);
            expect(resp.data[0].maxCredits).toBeNull();
            expect(resp.data[0].description).toBe("Programming language technologies (e.g., object-oriented programming), their implementations and use in software design and implementation.");
            expect(resp.data[0].genEds).toBeNull();
            expect(resp.data[0].conditions).toEqual([
                "Prerequisite: Minimum grade of C- in CMSC330; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program. ",
                "Restriction: Permission of CMNS-Computer Science department."
            ]);
            expect(resp.data[0].sections).not.toBeNull();
            if (resp.data[0].sections) {
                expect(resp.data[0].sections.length).toBe(1);
                const section = resp.data[0].sections[0];
                expect(section.sectionCode).toBe("0101");
                expect(section.courseCode).toBe("CMSC433");
            }
        }
    });

    it("fetches basic course by number", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: CoursesConfig = {
            number: "123",
            limit: 2,
            offset: 0,
            sortBy: new SortBy().ascending("course_code"),
        };
        const resp: CoursesBasicResponse = await client.courses(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            expect(resp.data[0].courseCode).toBe("AOSC123");
            expect(resp.data[1].courseCode).toBe("FMSC123");
        }
    });
});