import { RatingFilter } from "../../../src/api/api-filters";
import { instructorsConfigToQueryParams, sectionsConfigToQueryParams } from "../../../src/api/configs";
import { test, expect, describe } from "@jest/globals";
import { SortBy } from "../../../src/api/sort-by";

describe("instructorsConfigToQueryParams", () => {
    test("converts valid config to query params correctly", () => {
        const cfg = {
            instructorNames: new Set(["Jon Doe", "Jane Smith"]),
            instructorSlugs: null,
            ratings: new RatingFilter().greaterThan(4.3).lessThan(5.0),
            limit: 10,
            offset: 5,
            sortBy: new SortBy().ascending("average_rating").descending("name"),
        }

        const params = instructorsConfigToQueryParams(cfg);
        expect(params.toString()).toBe(
            "instructorNames=Jon+Doe%2CJane+Smith&limit=10&offset=5&ratings=gt.4.3&ratings=lt.5&sortBy=average_rating.asc%2Cname.desc"
        )
    })
})

describe("sectionsConfigToQueryParams", () => {
    test("converts valid config to query params correctly", () => {
        const cfg = {
            courseCodes: new Set(["CMSC131", "MATH140"]),
            prefix: null,
            limit: 20,
            offset: 5,
            sortBy: new SortBy().ascending("course_code").descending("sec_code"),
        }

        const params = sectionsConfigToQueryParams(cfg);
        expect(params.toString()).toBe(
            "courseCodes=CMSC131%2CMATH140&limit=20&offset=5&sortBy=course_code.asc%2Csec_code.desc"
        )
    });
}); 