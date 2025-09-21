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
export declare class GenEd {
    code: string;
    name: string;
    private constructor();
    static FSAW: GenEd;
    static FSAR: GenEd;
    static FSMA: GenEd;
    static FSOC: GenEd;
    static FSPW: GenEd;
    static DSHS: GenEd;
    static DSHU: GenEd;
    static DSNS: GenEd;
    static DSNL: GenEd;
    static DSSP: GenEd;
    static DVCC: GenEd;
    static DVUP: GenEd;
    static SCIS: GenEd;
    static fromCode(code: string): GenEd;
}
//# sourceMappingURL=course-traits.d.ts.map