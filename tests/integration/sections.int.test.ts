import { JupiterpClientV0, SortBy, SectionsConfig, SectionsResponse } from "../../src";

// These run against a live API, so what they can assert is limited by the fact
// that the data underneath them changes every term.
//
// They used to assert exact counts and a specific meeting time: BMGT407 had to
// return exactly 4 sections, and the first one had to meet Thursdays at 19:00
// in VMH 2203. Testudo rolled to a new term, BMGT407 became 2 sections, and the
// tests failed against production as readily as against a local clone -- while
// nothing was wrong. A test that fails on correct data stops being read.
//
// So they assert what stays true across terms instead. That is not a weaker
// check: "every returned section is the course I asked for" catches a filter
// silently not binding, which a row count never did. That is a real failure
// mode here -- Gin ignores query parameters it does not recognise, so a
// misspelled one returns the whole table and looks like success.

describe("sections integration tests", () => {
    it("filters by course code, and returns them in the requested order", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: SectionsConfig = {
            courseCodes: new Set(["BMGT407"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code").ascending("sec_code"),
        };

        const resp: SectionsResponse = await client.sections(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            // A course that has run every term for years. If this is empty the
            // filter matched nothing, which is a failure rather than a term
            // where nobody taught it.
            expect(resp.data.length).toBeGreaterThan(0);

            // The filter bound. Every row is the course that was asked for.
            for (const section of resp.data) {
                expect(section.courseCode).toBe("BMGT407");
            }

            // The sort bound. Without this the API can return a different
            // subset per page, which is how ~640 instructors went missing from
            // the planner on every load.
            const codes = resp.data.map((s) => s.sectionCode);
            expect([...codes].sort()).toStrictEqual(codes);

            // Meetings decode into one of the shapes the client models: a
            // string for the async/unscheduled cases, or a parsed classtime.
            for (const section of resp.data) {
                expect(Array.isArray(section.meetings)).toBe(true);
                for (const meeting of section.meetings) {
                    if (typeof meeting !== "string") {
                        expect(meeting).toHaveProperty("classtime");
                        expect(typeof meeting.classtime.start).toBe("number");
                        expect(meeting.classtime.end).toBeGreaterThanOrEqual(
                            meeting.classtime.start
                        );
                    }
                }
            }
        }
    });

    it("filters by instructor", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: SectionsConfig = {
            instructor: "Daniel Abadi",
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code").ascending("sec_code"),
        };

        const resp = await client.sections(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            // What they teach changes every term; that they are on every row
            // that comes back does not.
            expect(resp.data.length).toBeGreaterThan(0);
            for (const section of resp.data) {
                expect(section.instructors).toContain("Daniel Abadi");
            }
        }
    });

    it("does not return the whole table when a filter matches nothing", async () => {
        // The failure this guards against is specific: an ignored filter comes
        // back as a full unfiltered page, not as an error. A course code that
        // cannot exist must produce nothing at all.
        const client = JupiterpClientV0.createDefault();
        const resp = await client.sections({
            courseCodes: new Set(["ZZZZ999"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("course_code"),
        });

        expect(resp.statusCode).toBe(200);
        expect(resp.data ?? []).toHaveLength(0);
    });
});
