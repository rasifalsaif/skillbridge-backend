import { Router } from "express";
import * as controllers from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";

const authRouter = Router()

// Public routes — no token required
authRouter.post('/auth/register', controllers.registerController)
authRouter.post('/auth/login', controllers.loginController)

// Protected route — must be logged in to change password
authRouter.patch('/auth/change-password', authenticate, controllers.changePasswordController)

export default authRouter