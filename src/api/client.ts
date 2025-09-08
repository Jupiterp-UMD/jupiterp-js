export class JupiterpClientV0 {
    readonly dbUrl: string;

    public constructor(dbUrl: string) {
        if (!dbUrl) {
            throw new Error("Database URL must be provided");
        }
        this.dbUrl = dbUrl;
    }

    public static createDefault(): JupiterpClientV0 {
        return new JupiterpClientV0("https://api.jupiterp.com");
    }

    public async health(): Promise<Response> {
        return fetch(this.dbUrl + "/v0/");
    }
}