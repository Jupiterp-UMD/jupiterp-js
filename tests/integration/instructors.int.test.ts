import { JupiterpClientV0, InstructorsConfig, SortBy, InstructorsResponse } from "../../src";

// Slugs in these tests are Jupiterp's own (`daniel-abadi`), not PlanetTerp's
// (`abadi_daniel`), which is what this field held through v0.8.5. The old
// value is still available as `pt_slug`.
describe("instructors integration tests", () => {
    it("fetches instructors by name", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorsConfig = {
            instructorNames: new Set(["Daniel Abadi", "Bahar Asgari"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("name"),
        };

        const resp: InstructorsResponse = await client.instructors(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            expect(resp.data[0].name).toBe("Bahar Asgari");
            expect(resp.data[1].name).toBe("Daniel Abadi");
            expect(resp.data[0].slug).toBe("bahar-asgari");
            expect(resp.data[1].slug).toBe("daniel-abadi");
        }
    });

    it("fetches instructors by slug", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorsConfig = {
            instructorSlugs: new Set(["a-seyed", "daniel-abadi"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("name"),
        };

        const resp = await client.instructors(cfg);

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            expect(resp.data[0].name).toBe("A Seyed");
            expect(resp.data[1].name).toBe("Daniel Abadi");
            expect(resp.data[0].slug).toBe("a-seyed");
            expect(resp.data[1].slug).toBe("daniel-abadi");
        }
    });

    it("fetches only active instructors", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorsConfig = {
            // abay is not currently active. This test might fail in future.
            instructorSlugs: new Set(["daniel-abadi", "abay"]),
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("name"),
        };

        const resp = await client.activeInstructors(cfg);
        
        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(1);
            expect(resp.data[0].name).toBe("Daniel Abadi");
            expect(resp.data[0].slug).toBe("daniel-abadi");
            // Not asserting a specific rating: it is now a blend of Jupiterp
            // reviews and the frozen PlanetTerp baseline, and it decays with
            // time, so any fixed value here would start failing on its own.
            expect(resp.data[0].pt_slug).toBe("abadi_daniel");
        }
    });

    it("searches instructors by partial name", async () => {
        const client = JupiterpClientV0.createDefault();
        const resp = await client.instructors({
            nameSearch: "abadi",
            limit: 10,
        });

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBeGreaterThan(0);
            expect(resp.data.some((i) => i.name === "Daniel Abadi")).toBe(true);
        }
    });

    it("reports a total when asked for one", async () => {
        const client = JupiterpClientV0.createDefault();

        const without = await client.instructors({ limit: 5 });
        expect(without.total).toBeNull();

        const withCount = await client.instructors({ limit: 5, count: true });
        expect(withCount.total).not.toBeNull();
        if (withCount.total !== null && withCount.data) {
            expect(withCount.total).toBeGreaterThanOrEqual(withCount.data.length);
        }
    });
});
