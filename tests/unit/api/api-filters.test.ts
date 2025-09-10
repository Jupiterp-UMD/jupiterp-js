import { CreditFilter, RatingFilter } from "../../../src/api/api-filters";
import { test, expect, describe } from "@jest/globals";

describe("CreditFilter", () => {
    test("creates correct filter string", () => {
        const creditFilter = 
            new CreditFilter()
            .equalTo(3)
            .lessThan(5)
            .greaterThan(2)
            .lessThanOrEqualTo(1000)
            .greaterThanOrEqualTo(1)
            .notEqualTo(1);
        const filterStrings = creditFilter.argsArray();
        expect(filterStrings).toEqual([
            "eq.3",
            "lt.5",
            "gt.2",
            "lte.1000",
            "gte.1",
            "neq.1"
        ]);
    })
})

describe("RatingFilter", () => {
    test("creates correct filter string", () => {
        const ratingFilter = 
            new RatingFilter()
            .equalTo(3)
            .lessThan(5)
            .greaterThan(2)
            .lessThanOrEqualTo(1000)
            .greaterThanOrEqualTo(1)
            .notEqualTo(1);
        const filterStrings = ratingFilter.argsArray();
        expect(filterStrings).toEqual([
            "eq.3",
            "lt.5",
            "gt.2",
            "lte.1000",
            "gte.1",
            "neq.1"
        ]);
    })
})