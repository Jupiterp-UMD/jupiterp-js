import {
    gradesConfigToQueryParams,
    gradeSummaryConfigToQueryParams,
    reviewsConfigToQueryParams,
    instructorsConfigToQueryParams,
} from "../../../src/api/configs";
import { GpaFilter, GradedFilter, TermFilter } from "../../../src/api/api-filters";
import { SortBy } from "../../../src/api/sort-by";
import { parseContentRange } from "../../../src/api/responses";

describe("gradesConfigToQueryParams", () => {
    it("serializes course filters", () => {
        const params = gradesConfigToQueryParams({
            courseCodes: new Set(["CMSC132", "MATH140"]),
            limit: 50,
            offset: 10,
        });
        expect(params.get("courseCodes")).toBe("CMSC132,MATH140");
        expect(params.get("limit")).toBe("50");
        expect(params.get("offset")).toBe("10");
    });

    it("serializes instructor slug", () => {
        const params = gradesConfigToQueryParams({ instructorSlug: "shane-walsh" });
        expect(params.get("instructorSlug")).toBe("shane-walsh");
    });

    it("serializes repeated filter conditions", () => {
        const params = gradesConfigToQueryParams({
            terms: new TermFilter().greaterThanOrEqualTo(202008),
            gpa: new GpaFilter().greaterThanOrEqualTo(3).lessThan(4),
            graded: new GradedFilter().greaterThanOrEqualTo(20),
        });
        expect(params.get("term")).toBe("gte.202008");
        expect(params.getAll("gpa")).toEqual(["gte.3", "lt.4"]);
        expect(params.get("graded")).toBe("gte.20");
    });

    it("serializes instructor source tiers", () => {
        const params = gradesConfigToQueryParams({
            instructorSources: new Set(["reported", "testudo"]),
        });
        expect(params.get("instructorSource")).toBe("reported,testudo");
    });

    it("omits everything that was not set", () => {
        const params = gradesConfigToQueryParams({});
        expect(params.toString()).toBe("");
    });
});

describe("gradeSummaryConfigToQueryParams", () => {
    it("passes groupBy through", () => {
        for (const groupBy of [
            "course", "term", "instructor", "instructorOverall", "instructorTerm",
        ] as const) {
            const params = gradeSummaryConfigToQueryParams({ groupBy });
            expect(params.get("groupBy")).toBe(groupBy);
        }
    });

    it("serializes minStudents and includeCarried", () => {
        const params = gradeSummaryConfigToQueryParams({
            groupBy: "instructor",
            minStudents: 100,
            includeCarried: true,
        });
        expect(params.get("minStudents")).toBe("100");
        expect(params.get("includeCarried")).toBe("true");
    });

    it("omits includeCarried and count when false", () => {
        // Sending includeCarried=false would widen the aggregate rather than
        // narrow it, because the API reads presence rather than value.
        const params = gradeSummaryConfigToQueryParams({
            groupBy: "instructor",
            includeCarried: false,
            count: false,
        });
        expect(params.has("includeCarried")).toBe(false);
        expect(params.has("count")).toBe(false);
    });

    it("serializes sortBy", () => {
        const params = gradeSummaryConfigToQueryParams({
            sortBy: new SortBy().descending("gpa").ascending("course_code"),
        });
        expect(params.get("sortBy")).toBe("gpa.desc,course_code.asc");
    });
});

describe("instructorsConfigToQueryParams", () => {
    it("serializes the search and paging options added in v1", () => {
        const params = instructorsConfigToQueryParams({
            nameSearch: "walsh",
            activeOnly: true,
            count: true,
            limit: 50,
        });
        expect(params.get("nameSearch")).toBe("walsh");
        expect(params.get("activeOnly")).toBe("true");
        expect(params.get("count")).toBe("true");
    });

    it("omits activeOnly and count when false", () => {
        const params = instructorsConfigToQueryParams({
            activeOnly: false,
            count: false,
        });
        expect(params.has("activeOnly")).toBe(false);
        expect(params.has("count")).toBe(false);
    });
});

describe("reviewsConfigToQueryParams", () => {
    it("always sends the instructor slug", () => {
        const params = reviewsConfigToQueryParams({ instructorSlug: "shane-walsh" });
        expect(params.get("instructorSlug")).toBe("shane-walsh");
    });

    it("serializes the optional course filter and paging", () => {
        const params = reviewsConfigToQueryParams({
            instructorSlug: "shane-walsh",
            courseCode: "CMSC132",
            limit: 10,
            offset: 20,
        });
        expect(params.get("courseCode")).toBe("CMSC132");
        expect(params.get("limit")).toBe("10");
        expect(params.get("offset")).toBe("20");
    });
});

describe("parseContentRange", () => {
    it("reads the total out of a range header", () => {
        expect(parseContentRange("0-49/4812")).toBe(4812);
        expect(parseContentRange("*/0")).toBe(0);
    });

    it("returns null when no exact count was requested", () => {
        // PostgREST reports '*' as the total unless the caller asked for a
        // count. That is not an error, it just means nobody paid for one.
        expect(parseContentRange("0-49/*")).toBeNull();
    });

    it("returns null for a missing or unreadable header", () => {
        expect(parseContentRange(null)).toBeNull();
        expect(parseContentRange("")).toBeNull();
        expect(parseContentRange("nonsense")).toBeNull();
    });
});
