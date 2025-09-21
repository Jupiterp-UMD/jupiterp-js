/**
 * A generic API response wrapper that includes status information and the data
 * returned by the API.
 */
export class ApiResponse {
    constructor(statusCode, statusMessage, data) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }
    /**
     * Checks if the response was successful.
     * @returns True if the response status code indicates success (2xx), false otherwise.
     */
    ok() {
        return this.statusCode >= 200 && this.statusCode < 300;
    }
}
