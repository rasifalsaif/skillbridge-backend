import { Router } from "express";
import * as controllers from "./admin.controller"
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";

const adminRouter = Router()

adminRouter.get('/admin/analytics', authenticate, checkRole("ADMIN"), controllers.analyticsController)
adminRouter.get('/admin/users', authenticate, checkRole("ADMIN"), controllers.getUsersController)
adminRouter.patch('/admin/users/:id/moderate', authenticate, checkRole("ADMIN"), controllers.moderateUserController)
adminRouter.post('/admin/categories', authenticate, checkRole("ADMIN"), controllers.createCategoryController)
adminRouter.patch('/admin/categories/:id', authenticate, checkRole("ADMIN"), controllers.updateCategoryController)
adminRouter.delete('/admin/categories/:id', authenticate, checkRole("ADMIN"), controllers.deleteCategoryController)

export default adminRouter