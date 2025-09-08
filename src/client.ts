export class JupiterpClientV0 {
    readonly dbUrl: string;

    constructor(dbUrl: string) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
    }

    static createDefault(): JupiterpClientV0 {
        return new JupiterpClientV0("https://api.jupiterp.com");
    }

    async health(): Promise<Response> {
        return fetch(this.dbUrl + "/v0/");
    }
}