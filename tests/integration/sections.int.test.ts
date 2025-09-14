import { JupiterpClientV0, SortBy, SectionsConfig, SectionsResponse } from "../../src";

describe("sections integration tests", () => {
    it("fetches sections by course codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: SectionsConfig = {
            courseCodes: new Set(["BMGT407"]),
            prefix: null,
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code").ascending("sec_code"),
        };

        const resp: SectionsResponse = await client.sections(cfg);
        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            
            expect(resp.data[0].courseCode).toBe("BMGT407");
            expect(resp.data[0].sectionCode).toBe("0101");
            expect(resp.data[1].sectionCode).toBe("0201");
            expect(resp.data[0].meetings[0]).toStrictEqual(
                { classtime: { days: "Th", start: 19.0, end: (21 + 4/6) }, location: { building: "VMH", room: "2203" } }
            );
            expect(resp.data[0].meetings[1]).toBe("OnlineAsync");
        }
    });
});