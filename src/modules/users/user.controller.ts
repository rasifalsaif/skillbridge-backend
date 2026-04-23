import type { NextFunction, Request, Response } from "express";
import type { User } from "../../generated/prisma/client";
import { UpdateUserSchema } from "../auth/auth.schema";
import { getHomeStatsService, getUserProfileService, getUserStatsService, updateUserProfileService } from "./user.service";

/**
 * GET /api/home-stats
 * Public endpoint. Returns featured tutors, categories, and platform-wide
 * student/tutor counts for the landing page. No authentication required.
 */
export const getHomeStatsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getHomeStatsService()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

/**
 * GET /api/users/me  (requires authentication)
 * Returns the full profile of the currently logged-in user.
 * The userId is extracted from the JWT token, not the URL.
 */
export const getUserProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getUserProfileService(req.user!.userId)
        res.json({
            success: true,
            data: {
                user: result
            }
        })
    } catch (error) {
        next(error)
    }
};

/**
 * GET /api/users/stats  (requires authentication)
 * Returns role-specific dashboard stats for the currently logged-in user.
 * Tutors get earnings, sessions taught, and ratings.
 * Students get active bookings, completed hours, and learning points.
 */
export const getUserStatsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getUserStatsService(req.user!.userId, req.user!.role)
        res.json({
            success: true,
            data: {
                stats: result
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * PATCH /api/users/me  (requires authentication)
 * Validates and updates the profile (name, email, etc.) of the logged-in user.
 * Password changes should go through the dedicated change-password endpoint instead.
 */
export const updateUserProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = UpdateUserSchema.parse(req.body) as Partial<User>
        const result = await updateUserProfileService(req.user!.userId, validatedData)
        res.json({
            success: true,
            message: "User updated successfully",
            data: {
                user: result
            }
        })
    } catch (error) {
        next(error)
    }
};