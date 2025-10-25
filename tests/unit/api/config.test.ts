import { RatingFilter } from "../../../src/api/api-filters";
import { CoursesWithSectionsConfig, coursesWithSectionsConfigToQueryParams, instructorsConfigToQueryParams, sectionsConfigToQueryParams } from "../../../src/api/configs";
import { test, expect, describe } from "@jest/globals";
import { SortBy } from "../../../src/api/sort-by";
import { GenEd } from "../../../src/common/gen-eds";

describe("instructorsConfigToQueryParams", () => {
    test("converts valid config to query params correctly", () => {
        const cfg = {
            instructorNames: new Set(["Jon Doe", "Jane Smith"]),
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

describe("courseConfigToQueryParams", () => {
    test("converts valid with sections config to query params correctly", () => {
        const cfg: CoursesWithSectionsConfig = {
            courseCodes: new Set(["CMSC131", "MATH140"]),
            genEds: new Set([GenEd.DSHS, GenEd.SCIS]),
            limit: 15,
            offset: 0,
            sortBy: new SortBy().ascending("course_code").descending("course_code"),
        }

        const params = coursesWithSectionsConfigToQueryParams(cfg);
        expect(params.toString()).toBe(
            "courseCodes=CMSC131%2CMATH140&genEds=DSHS%2CSCIS&limit=15&offset=0&sortBy=course_code.asc%2Ccourse_code.desc"
        );
    });
});