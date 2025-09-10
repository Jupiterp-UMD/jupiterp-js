import { JupiterpClientV0 } from "../../src";
import { jest, test, expect, describe, beforeEach } from "@jest/globals";

describe("JupiterpClientV0", () => {
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

  test("throws if no dbUrl is provided", () => {
    expect(() => new JupiterpClientV0("")).toThrow("Database URL must be provided");
    // runtime check for missing arg:
    expect(() => new (JupiterpClientV0 as unknown as new (...args: any[]) => any)()).toThrow(
      "Database URL must be provided"
    );
  });

  test("creates instance with provided dbUrl", () => {
    const client = new JupiterpClientV0("https://custom-url.com");
    expect(client.dbUrl).toBe("https://custom-url.com");
  });

  test("createDefault returns instance with default URL", () => {
    const client = JupiterpClientV0.createDefault();
    expect(client.dbUrl).toBe("https://api.jupiterp.com");
  });

  test("connect makes a fetch call to the correct URL", async () => {
    const mockResponse = new Response(null, { status: 200 });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const response = await client.health();

    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/");
    expect(response).toBe(mockResponse);
  });

  test("successfull instructors fetch has correct response", async () => {
    const mockInstructors = [
      { slug: "doe", name: "John Doe", average_rating: 4.3 },
      { slug: "smith", name: "Jane Smith", average_rating: 4.7 },
    ];
    const mockResponse = new Response(JSON.stringify(mockInstructors), { status: 200, statusText: "OK" });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const resp = await client.instructors({
      instructorNames: new Set(["John Doe", "Jane Smith"]),
      instructorSlugs: null,
      ratings: null,
      limit: 10,
      offset: 0,
      sortBy: null,
    });
    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/instructors?instructorNames=John+Doe%2CJane+Smith&limit=10&offset=0");
    expect(resp.statusCode).toBe(200);
    expect(resp.statusMessage).toBe("OK");
    expect(resp.data).toEqual(mockInstructors);
  });

  test("failed instructors fetch has correct response", async () => {
    const mockResponse = new Response(null, { status: 500, statusText: "Internal Server Error" });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const resp = await client.instructors({
      instructorNames: new Set(["John Doe", "Jane Smith"]),
      instructorSlugs: null,
      ratings: null,
      limit: 10,
      offset: 0,
      sortBy: null,
    });
    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/instructors?instructorNames=John+Doe%2CJane+Smith&limit=10&offset=0");
    expect(resp.statusCode).toBe(500);
    expect(resp.statusMessage).toBe("Internal Server Error");
    expect(resp.data).toBeNull();
  });
});
