import { RatingFilter } from "../../src/api/api-filters";
import { instructorConfigToQueryParams } from "../../src/api/configs";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";
import { SortBy } from "../../src/api/sort-by";

describe("instructorConfigToQueryParams", () => {
    test("converts valid config to query params correctly", () => {
        const cfg = {
            instructorNames: new Set(["Jon Doe", "Jane Smith"]),
            instructorSlugs: null,
            ratings: new RatingFilter().greaterThan(4.3).lessThan(5.0),
            limit: 10,
            offset: 5,
            sortBy: new SortBy().ascending("average_rating").descending("name"),
        }

        const params = instructorConfigToQueryParams(cfg);
        expect(params.toString()).toBe(
            "instructorNames=Jon+Doe%2CJane+Smith&limit=10&offset=5&ratings=gt.4.3&ratings=lt.5&sortBy=average_rating.asc%2Cname.desc"
        )
    })
})