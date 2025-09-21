export function coursesConfigToQueryParams(cfg) {
    const params = new URLSearchParams();
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.genEds && cfg.genEds.size > 0) {
        params.append("genEds", Array.from(cfg.genEds).join(","));
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.creditFilters) {
        for (const arg of cfg.creditFilters.argsArray()) {
            params.append("creditFilters", arg);
        }
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}
export function sectionsConfigToQueryParams(cfg) {
    const params = new URLSearchParams();
    if (cfg.courseCodes && cfg.courseCodes.size > 0) {
        params.append("courseCodes", Array.from(cfg.courseCodes).join(","));
    }
    if (cfg.prefix) {
        params.append("prefix", cfg.prefix);
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}
export function instructorsConfigToQueryParams(cfg) {
    const params = new URLSearchParams();
    if (cfg.instructorNames && cfg.instructorNames.size > 0) {
        params.append("instructorNames", Array.from(cfg.instructorNames).join(","));
    }
    if (cfg.instructorSlugs && cfg.instructorSlugs.size > 0) {
        params.append("instructorSlugs", Array.from(cfg.instructorSlugs).join(","));
    }
    if (cfg.limit !== null && cfg.limit !== undefined) {
        params.append("limit", cfg.limit.toString());
    }
    if (cfg.offset !== null && cfg.offset !== undefined) {
        params.append("offset", cfg.offset.toString());
    }
    if (cfg.ratings) {
        for (const arg of cfg.ratings.argsArray()) {
            params.append("ratings", arg);
        }
    }
    if (cfg.sortBy && cfg.sortBy.length() > 0) {
        params.append("sortBy", cfg.sortBy.argsArray().join(","));
    }
    return params;
}
