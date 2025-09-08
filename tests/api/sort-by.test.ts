import { SortBy } from "../../src/api/sort-by";
import { test, expect, describe } from "@jest/globals";

describe("SortBy", () => {
    test("creates correct sort string", () => {
        const sortBy = 
            new SortBy()
            .ascending("name")
            .descending("min_credits");
        expect(sortBy.stringify()).toBe("sortBy=name.asc,min_credits.desc");
    });
});