import { Router } from "express";
import * as controllers from "./user.controller"
import { authenticate } from "../../middlewares/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";

const userRouter = Router()

userRouter.get('/home/stats', asyncHandler(controllers.getHomeStatsController))
userRouter.get('/user/profile', authenticate, asyncHandler(controllers.getUserProfileController))
userRouter.get('/user/stats', authenticate, asyncHandler(controllers.getUserStatsController))
userRouter.patch('/user/profile', authenticate, asyncHandler(controllers.updateUserProfileController))

export default userRouter 