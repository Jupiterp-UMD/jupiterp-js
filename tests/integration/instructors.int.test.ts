import { JupiterpClientV0 } from "../../src";
import { InstructorConfig } from "../../src/api/configs";
import { SortBy } from "../../src/api/sort-by";

describe("instructors integration tests", () => {
    it("fetches instructors by name", async () => {
        const client = JupiterpClientV0.createDefault();
        const cfg: InstructorConfig = {
            instructorNames: new Set(["Daniel Abadi", "Bahar Asgari"]),
            instructorSlugs: null,
            ratings: null,
            limit: 10,
            offset: 0,
            sortBy: new SortBy().ascending("name"),
        };
        const resp = await client.instructors(cfg);
        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBe(2);
            expect(resp.data[0].name).toBe("Bahar Asgari");
            expect(resp.data[1].name).toBe("Daniel Abadi");
            expect(resp.data[0].slug).toBe("asgari_bahar");
            expect(resp.data[1].slug).toBe("abadi_daniel");
        }
    })
});