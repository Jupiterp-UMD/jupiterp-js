import { DepartmentsResponse, JupiterpClientV0 } from "../../src";

describe("department endpoints integration tests", () => {
    it("fetches list of department codes", async () => {
        const client = JupiterpClientV0.createDefault();
        const resp: DepartmentsResponse = await client.deptList();

        expect(resp.statusCode).toBe(200);
        expect(resp.data).not.toBeNull();
        if (resp.data) {
            expect(resp.data.length).toBeGreaterThan(0);
            expect(resp.data[0]).toBe("AAAS");
            expect(resp.data[1]).toBe("AAST");
        }
    });
});