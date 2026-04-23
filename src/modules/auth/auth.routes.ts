import { Router } from "express";
import * as controllers from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";

const authRouter = Router()

// Public routes — no token required
authRouter.post('/auth/register', asyncHandler(controllers.registerController))
authRouter.post('/auth/login', asyncHandler(controllers.loginController))

// Protected route — must be logged in to change password
authRouter.patch('/auth/change-password', authenticate, asyncHandler(controllers.changePasswordController))

export default authRouter