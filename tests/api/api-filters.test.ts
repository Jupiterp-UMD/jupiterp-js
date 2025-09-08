import { CreditFilter, RatingFilter } from "../../src/api/api-filters";
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
        expect(creditFilter.stringify()).toBe("credits=eq.3&credits=lt.5&credits=gt.2&credits=lte.1000&credits=gte.1&credits=neq.1");
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
        expect(ratingFilter.stringify()).toBe("ratings=eq.3&ratings=lt.5&ratings=gt.2&ratings=lte.1000&ratings=gte.1&ratings=neq.1");
    })
})