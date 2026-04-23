import { Router } from "express";
import * as controllers from "./admin.controller"
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";
import { asyncHandler } from "../../utils/asyncHandler";

const adminRouter = Router()

adminRouter.get('/admin/analytics', authenticate, checkRole("ADMIN"), asyncHandler(controllers.analyticsController))
adminRouter.get('/admin/users', authenticate, checkRole("ADMIN"), asyncHandler(controllers.getUsersController))
adminRouter.patch('/admin/users/:id/moderate', authenticate, checkRole("ADMIN"), asyncHandler(controllers.moderateUserController))
adminRouter.post('/admin/categories', authenticate, checkRole("ADMIN"), asyncHandler(controllers.createCategoryController))
adminRouter.patch('/admin/categories/:id', authenticate, checkRole("ADMIN"), asyncHandler(controllers.updateCategoryController))
adminRouter.delete('/admin/categories/:id', authenticate, checkRole("ADMIN"), asyncHandler(controllers.deleteCategoryController))

export default adminRouter