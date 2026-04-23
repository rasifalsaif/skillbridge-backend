import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../types/jwtPayload";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

/**
 * Authentication middleware.
 * Checks every protected route for a valid Bearer token in the Authorization header.
 * If the token is missing, malformed, or invalid, the request is rejected with a 401.
 * On success, the decoded user payload (userId + role) is attached to `req.user`
 * so downstream controllers know who is making the request.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = (req.headers.authorization || req.headers.Authorization) as string

        if (!authHeader) {
            throw new ApiError(401, "No authorization header was found")
        }

        if (!authHeader.startsWith("Bearer")) {
            throw new ApiError(401, "Invalid token")
        }

        const token = authHeader.split(" ")[1]!

        const payload = verifyToken(token) as JwtPayload

        req.user = {
            userId: payload.userId,
            role: payload.role
        }
        next()
    } catch (error) {
        next(error)
    }
};
