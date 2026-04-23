import type { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/enums";
import { ApiError } from "../utils/ApiError";

/**
 * Role-based authorization middleware factory.
 * Returns a middleware that checks whether the currently authenticated user
 * has the required role. Use this after the `authenticate` middleware.
 *
 * Example usage:
 *   router.get('/admin/users', authenticate, checkRole('ADMIN'), controller)
 *
 * If the user's role doesn't match, the request is rejected with 403 Forbidden.
 */
export const checkRole = (role: keyof typeof Role) => (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user!.role !== role) {
            throw new ApiError(403, "Forbidden. You don't have sufficient permission to perform this action")
        }
        next()
    } catch (error) {
        next(error)
    }
};
