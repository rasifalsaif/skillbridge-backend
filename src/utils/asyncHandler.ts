import type { NextFunction, Request, Response } from 'express'

/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handler middleware.
 *
 * This ensures that unhandled promise rejections in async route
 * handlers are properly caught and sent to next(error).
 *
 * Usage: asyncHandler(async (req, res, next) => { ... })
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
