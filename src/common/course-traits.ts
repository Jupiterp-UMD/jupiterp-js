/**
 * A GenEd (General Education) requirement at UMD as listed on Testudo.
 * GenEds are currently hard-coded, so it is possible that they are not
 * up-to-date. If they are not, please contact the maintainer of this library.
 * 
 * GenEds are static and can be accessed and used like so:
 * ```ts
 * const genEd = GenEd.FSAW; // Academic Writing
 * console.log(genEd.code); // "FSAW"
 * console.log(genEd.name); // "Academic Writing"
 * ```
 */
export class GenEd {
    code: string;
    name: string;

    private constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }

    // This approach must be kept up-to-date with GenEds listed on Testudo.
    // Therefore it is fairly fragile. A better approach might be to fetch this
    // directly from Testudo. This is simpler and more efficient though.
    // Consider adding integration tests to ensure it's up-to-date. 

    public static FSAW = new GenEd("FSAW", "Academic Writing");
    public static FSAR = new GenEd("FSAR", "Analytic Reasoning")
    public static FSMA = new GenEd("FSMA", "Math");
    public static FSOC = new GenEd("FSOC", "Oral Communications");
    public static FSPW = new GenEd("FSPW", "Professional Writing");

    public static DSHS = new GenEd("DSHS", "History and Social Sciences")
    public static DSHU = new GenEd("DSHU", "Humanities")
    public static DSNS = new GenEd("DSNS", "Natural Sciences")
    public static DSNL = new GenEd("DSNL", "Natural Science Lab")
    public static DSSP = new GenEd("DSSP", "Scholarship in Practice")

    public static DVCC = new GenEd("DVCC", "Cultural Competency")
    public static DVUP = new GenEd("DVUP", "Understanding Plural Societies")

    public static SCIS = new GenEd("SCIS", "Signature Courses - Big Question")
}