/**
 * Custom error class for API responses.
 * Extends the built-in Error so it can be thrown like a normal error,
 * but also carries an HTTP status code (e.g. 400, 401, 404, 500).
 * The global error handler catches this and sends the correct HTTP response.
 */
export class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
    }
}