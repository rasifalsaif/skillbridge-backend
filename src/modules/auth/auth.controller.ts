import type { NextFunction, Request, Response } from "express";
import { LoginSchema, PasswordChangeSchema, UserSchema } from "./auth.schema";
import { changePasswordService, loginService, registerService } from "./auth.service";

/**
 * POST /api/auth/register
 * Validates the request body and registers a new user.
 * Returns 201 with user data and a JWT token on success.
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = UserSchema.parse(req.body)
        const data = await registerService(validatedData)
        res.status(201).json({
            success: true,
            message: "Registration successfull",
            data
        })
    } catch (error) {
        next(error)
    }
};

/**
 * POST /api/auth/login
 * Validates the request body and authenticates the user.
 * Returns 200 with user data and a JWT token on success.
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = LoginSchema.parse(req.body)
        const data = await loginService(validatedData)
        res.json({
            success: true,
            message: "Login successfull",
            data
        })
    } catch (error) {
        next(error)
    }
};

/**
 * PATCH /api/auth/change-password  (requires authentication)
 * Validates and changes the password for the currently logged-in user.
 * The userId is taken from the JWT token, not from the request body.
 */
export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = PasswordChangeSchema.parse(req.body)
        await changePasswordService(req.user!.userId, validatedData)
        res.json({
            success: true,
            message: "Password has been changed"
        })
    } catch (error) {
        next(error)
    }
};
