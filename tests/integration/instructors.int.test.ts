import { JupiterpClientV0, InstructorsConfig, SortBy, InstructorsResponse } from "../../src";

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
            expect(resp.data[0].slug).toBe("asgari_bahar");
            expect(resp.data[1].slug).toBe("abadi_daniel");
        }
    });

    it("fetches instructors by slug", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorsConfig = {
            instructorSlugs: new Set(["seyed", "abadi_daniel"]),
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
            expect(resp.data[0].slug).toBe("seyed");
            expect(resp.data[1].slug).toBe("abadi_daniel");
        }
    });

    it("fetches only active instructors", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorsConfig = {
            // abay is not currently active. This test might fail in future.
            instructorSlugs: new Set(["abadi_daniel", "abay"]),
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
            expect(resp.data[0].slug).toBe("abadi_daniel");
            expect(resp.data[0].average_rating).toBe(3.122);
        }
    });
});