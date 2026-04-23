import { Router } from "express";
import * as controllers from "./user.controller"
import { authenticate } from "../../middlewares/authenticate";

const userRouter = Router()

userRouter.get('/home/stats', controllers.getHomeStatsController)
userRouter.get('/user/profile', authenticate, controllers.getUserProfileController)
userRouter.get('/user/stats', authenticate, controllers.getUserStatsController)
userRouter.patch('/user/profile', authenticate, controllers.updateUserProfileController)

export default userRouter 