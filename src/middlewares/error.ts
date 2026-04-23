import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

/**
 * Global error handler middleware.
 * This must be registered last in the Express app (after all routes),
 * so it catches any error passed via next(error) from controllers and middlewares.
 *
 * It normalizes different error types into a consistent JSON response:
 * - ApiError         → custom HTTP status + message (e.g. 404, 401)
 * - JWT errors       → 401 Unauthorized (expired or invalid token)
 * - ZodError         → 400 Bad Request (request body failed validation)
 * - Prisma errors    → 400 Bad Request (database-level issues)
 * - Anything else    → 500 Internal Server Error
 */
export const globalErrorHandler = (error: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    let message = "Internal Server Error"

    if (error instanceof ApiError) {
        statusCode = error.statusCode
        message = error.message
    } else if (error instanceof jwt.TokenExpiredError) {
        statusCode = 401
        message = "Invalid token"
    } else if (error instanceof ZodError) {
        statusCode = 400
        message = "Validation failed. Please check your input."
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
    ) {
        statusCode = 400
        message = "A database error occurred while processing your request."
    }

    console.error('[ERROR HANDLER]', {
        statusCode,
        message,
        errorName: error?.name,
        errorMessage: error?.message,
        stack: error?.stack
    });
    
    res.status(statusCode).json({
        success: false,
        message: message
    })
};
