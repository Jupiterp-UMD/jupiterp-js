function parseTime(s) {
    s = s.toLowerCase();
    const parts = s.split(":");
    let hours = parseInt(parts[0]);
    if (s.includes("pm") && hours < 12) {
        hours += 12;
    }
    else if (s.includes("am") && hours === 12) {
        hours = 0;
    }
    const minutes = parseInt(parts[1].replace("am", "").replace("pm", ""));
    return hours + minutes / 60;
}
function classMeetingFromString(s) {
    switch (s) {
        case "OnlineAsync":
            return "OnlineAsync";
        case "Unknown":
            return "Unknown";
        case "TBA":
            return "TBA";
        default:
            const parts = s.split("-");
            const days = parts[0];
            const start = parseTime(parts[1]);
            const end = parseTime(parts[2]);
            const building = parts[3];
            const room = parts.length > 4 ? parts[4] : "";
            return {
                classtime: { days, start, end },
                location: { building, room },
            };
    }
}
/**
 * Converts a SectionRaw object to a Section object.
 * @param raw Raw section data from the API.
 * @returns A parsed Section object.
 */
export function parseRawSection(raw) {
    return {
        courseCode: raw.course_code,
        sectionCode: raw.sec_code,
        instructors: raw.instructors,
        meetings: raw.meetings.map(classMeetingFromString),
        openSeats: raw.open_seats,
        totalSeats: raw.total_seats,
        waitlist: raw.waitlist,
        holdfile: raw.holdfile,
    };
}
