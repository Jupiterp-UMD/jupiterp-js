import { JupiterpClientV0 } from "../../../src";
import { jest, test, expect, describe, beforeEach } from "@jest/globals";
import { Section, SectionRaw } from "../../../src/common/section";
import { SectionsConfig } from "../../../src/api/configs";

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

  test("successfully instructors fetch has correct response", async () => {
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

  test("successfully fetches active instructors", async () => {
    const mockInstructors = [
      { slug: "doe", name: "John Doe", average_rating: 4.3 },
    ];
    const mockResponse = new Response(JSON.stringify(mockInstructors), { status: 200, statusText: "OK" });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const resp = await client.activeInstructors({
      instructorNames: null,
      instructorSlugs: new Set(["doe"]),
      ratings: null,
      limit: 5,
      offset: 0,
      sortBy: null,
    });

    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/instructors/active?instructorSlugs=doe&limit=5&offset=0");
    expect(resp.statusCode).toBe(200);
    expect(resp.statusMessage).toBe("OK");
    expect(resp.data).toEqual(mockInstructors); 
  });

  test("failed sections fetch has correct response", async () => {
    const args: SectionsConfig = {
      courseCodes: null,
      prefix: null,
      limit: null,
      offset: null,
      sortBy: null,
    }
    const mockResponse = new Response(null, { status: 404, statusText: "Not Found" });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const resp = await client.sections(args);

    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/sections?");
    expect(resp.statusCode).toBe(404);
    expect(resp.statusMessage).toBe("Not Found");
    expect(resp.data).toBeNull();
  });

  test("successfully fetches sections", async () => {
    const args: SectionsConfig = {
      courseCodes: null,
      prefix: null,
      limit: null,
      offset: null,
      sortBy: null,
    }
    const mockSections: SectionRaw[] = [
      { course_code: "CMSC131", sec_code: "0101", instructors: ["John Doe"], meetings: ["OnlineAsync"], open_seats: 5, total_seats: 30, waitlist: 0, holdfile: null },
      { course_code: "MATH140", sec_code: "0201", instructors: ["Jane Smith"], meetings: ["TBA"], open_seats: 0, total_seats: 25, waitlist: 10, holdfile: 2 },
      { course_code: "BMGT298M", sec_code: "0101", instructors: ["Testudo Testudo"], meetings: ["Unknown"], open_seats: 0, total_seats: 0, waitlist: 0, holdfile: null },
      { course_code: "ENEE150", sec_code: "0301", instructors: ["Alice Johnson"], meetings: ["MWF-10:00am-11:00am-ENGR-2100"], open_seats: 3, total_seats: 40, waitlist: 5, holdfile: 1 },
      { course_code: "ASTR320", sec_code: "F010", instructors: ["Albuquerque Joe", "Jennifer Tallahassee"], meetings: ["MWF-10:00am-10:45am-ESJ-0101", "T-2:00pm-4:00pm-OnlineSync"], open_seats: 2, total_seats: 20, waitlist: 0, holdfile: null },
    ];
    const expectedParsedSections: Section[] = [
      { courseCode: "CMSC131", sectionCode: "0101", instructors: ["John Doe"], meetings: ["OnlineAsync"], openSeats: 5, totalSeats: 30, waitlist: 0, holdfile: null },
      { courseCode: "MATH140", sectionCode: "0201", instructors: ["Jane Smith"], meetings: ["TBA"], openSeats: 0, totalSeats: 25, waitlist: 10, holdfile: 2 },
      { courseCode: "BMGT298M", sectionCode: "0101", instructors: ["Testudo Testudo"], meetings: ["Unknown"], openSeats: 0, totalSeats: 0, waitlist: 0, holdfile: null },
      { courseCode: "ENEE150", sectionCode: "0301", instructors: ["Alice Johnson"], meetings: [{ classtime: { days: "MWF", start: 10.0, end: 11.0 }, location: { building: "ENGR", room: "2100" } }], openSeats: 3, totalSeats: 40, waitlist: 5, holdfile: 1 },
      { courseCode: "ASTR320", sectionCode: "F010", instructors: ["Albuquerque Joe", "Jennifer Tallahassee"], meetings: [{ classtime: { days: "MWF", start: 10.0, end: 10.75 }, location: { building: "ESJ", room: "0101" } }, { classtime: { days: "T", start: 14.0, end: 16.0 }, location: { building: "OnlineSync", room: "" } }], openSeats: 2, totalSeats: 20, waitlist: 0, holdfile: null },
    ];
    const mockResponse = new Response(JSON.stringify(mockSections), { status: 200, statusText: "OK" });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const client = new JupiterpClientV0("https://custom-url.com");
    const resp = await client.sections(args);

    expect(global.fetch).toHaveBeenCalledWith("https://custom-url.com/v0/sections?");
    expect(resp.statusCode).toBe(200);
    expect(resp.statusMessage).toBe("OK");
    expect(resp.data).toEqual(expectedParsedSections);
  })
});
