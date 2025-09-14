import {
    JupiterpClientV0, 
    CourseBasic, 
    CoursesBasicResponse, 
    CoursesConfig, 
    SortBy,
    GenEd
} from "../../src";

describe("courses endpoints integration tests", () => {
    it("fetches basic course info by course codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: CoursesConfig = {
            courseCodes: new Set(["CMSC131", "MATH140"]),
            creditFilters: null,
            genEds: null,
            prefix: null,
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
})