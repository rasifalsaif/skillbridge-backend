import type { NextFunction, Request, Response } from "express";
import { analyticsService, createCategoryService, deleteCategoryService, getUsersService, moderateUserService, updateCategoryService } from "./admin.service";

/**
 * GET /api/admin/analytics  (requires authentication, ADMIN only)
 * Returns platform stats: total students, tutors, and bookings.
 */
export const analyticsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await analyticsService()
        res.json({
            success: true,
            data: stats
        })
    } catch (error) {
        next(error)
    }
};

/**
 * GET /api/admin/users  (requires authentication, ADMIN only)
 * Returns all users on the platform (excluding the admin themselves).
 * Includes ban status and tutor profile details.
 */
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getUsersService(req.user!.userId)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * PATCH /api/admin/users/:id/moderate  (requires authentication, ADMIN only)
 * Bans or unbans a user.
 * Pass ?action=BAN or ?action=UNBAN as a query parameter.
 */
export const moderateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string
        const action: "BAN" | "UNBAN" = req.query.action as "BAN" | "UNBAN"
        await moderateUserService(userId, action)
        res.json({
            success: true,
            message: "User has been moderated successfully"
        })
    } catch (error) {
        next(error)
    }
};

/**
 * POST /api/admin/categories  (requires authentication, ADMIN only)
 * Creates a new subject category. The category name is required in the request body.
 */
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body
        const result = await createCategoryService(name)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * PATCH /api/admin/categories/:id  (requires authentication, ADMIN only)
 * Updates the name of an existing category by its ID.
 */
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body
        const result = await updateCategoryService(req.params.id as string, name)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * DELETE /api/admin/categories/:id  (requires authentication, ADMIN only)
 * Deletes a category by its ID.
 * Tutors in this category will have their categoryId set to null.
 */
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await deleteCategoryService(req.params.id as string)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};
