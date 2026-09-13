import { JupiterpClientV0, JupiterpClientV1 } from "../../../src";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";
import { SortBy } from "../../../src/api/sort-by";

/**
 * Which prefix each client reads from.
 *
 * The read endpoints are served under both `/v1` and `/v0` by the same
 * handlers, and the only difference between these two classes is which one they
 * request. That makes the difference invisible in every other test: both return
 * the same data, so a client silently reading from the wrong prefix passes
 * everything except this file.
 *
 * It matters for `JupiterpClientV0` in particular. It exists to keep 1.x
 * consumers working, which it only does while it actually calls `/v0` -- if it
 * quietly moved to `/v1`, it would break against any deployment that predates
 * the `/v1` read surface, which is exactly the population it is there to serve.
 *
 * Asserted on the request URL rather than the response, because the responses
 * are identical by design and cannot distinguish the two.
 */
describe("read prefix by client version", () => {
    let originalFetch: typeof fetch;
    let fetchMock: jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
        fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
        fetchMock.mockReset();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    const requestedUrl = (): string => {
        const call = fetchMock.mock.calls[0];
        expect(call).toBeDefined();
        return String(call[0]);
    };

    const okJson = (body: unknown) =>
        new Response(JSON.stringify(body), { status: 200, statusText: "OK" });

    test("V1 reads from /v1 and V0 reads from /v0", async () => {
        for (const { client, prefix } of [
            { client: new JupiterpClientV1("https://api.example.com"), prefix: "/v1" },
            { client: new JupiterpClientV0("https://api.example.com"), prefix: "/v0" },
        ]) {
            fetchMock.mockReset();
            fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

            await client.health();

            expect(requestedUrl()).toBe(`https://api.example.com${prefix}/`);
        }
    });

    test("every read endpoint carries the client's prefix", async () => {
        // One call per read endpoint, so a path that was missed when the
        // prefix was made configurable shows up here rather than at runtime.
        const endpoints: Array<{
            name: string;
            path: string;
            call: (c: JupiterpClientV1 | JupiterpClientV0) => Promise<unknown>;
            body: unknown;
        }> = [
            {
                name: "courses",
                path: "/courses?",
                call: (c) => c.courses({ courseCodes: new Set(["CMSC131"]), limit: 1, offset: 0, sortBy: new SortBy().ascending("course_code") }),
                body: [],
            },
            {
                name: "minifiedCourses",
                path: "/courses/minified?",
                call: (c) => c.minifiedCourses({ courseCodes: new Set(["CMSC131"]), limit: 1, offset: 0, sortBy: new SortBy().ascending("course_code") }),
                body: [],
            },
            {
                name: "coursesWithSections",
                path: "/courses/withSections?",
                call: (c) => c.coursesWithSections({ courseCodes: new Set(["CMSC131"]), limit: 1, offset: 0, sortBy: new SortBy().ascending("course_code") }),
                body: [],
            },
            {
                name: "sections",
                path: "/sections?",
                call: (c) => c.sections({ courseCodes: new Set(["CMSC131"]), limit: 1, offset: 0, sortBy: new SortBy().ascending("course_code") }),
                body: [],
            },
        ];

        for (const endpoint of endpoints) {
            for (const { client, prefix } of [
                { client: new JupiterpClientV1("https://api.example.com"), prefix: "/v1" },
                { client: new JupiterpClientV0("https://api.example.com"), prefix: "/v0" },
            ]) {
                fetchMock.mockReset();
                fetchMock.mockResolvedValueOnce(okJson(endpoint.body));

                await endpoint.call(client);

                expect(`${endpoint.name}: ${requestedUrl()}`).toContain(
                    `${endpoint.name}: https://api.example.com${prefix}${endpoint.path}`
                );
            }
        }
    });

    test("review endpoints stay on /v1 for both clients", async () => {
        // Reviews have only ever existed under /v1. They are not part of the
        // read surface and must not follow the prefix -- a V0 client pointing
        // review calls at /v0 would 404 against every deployment.
        for (const client of [
            new JupiterpClientV1("https://api.example.com"),
            new JupiterpClientV0("https://api.example.com"),
        ]) {
            fetchMock.mockReset();
            fetchMock.mockResolvedValueOnce(okJson([]));

            await client.reviews({ instructorSlug: "clyde-kruskal", limit: 1, offset: 0 });

            expect(requestedUrl()).toContain("https://api.example.com/v1/reviews");
        }
    });
});
