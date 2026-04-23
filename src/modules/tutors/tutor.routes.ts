import { Router } from "express";
import * as controllers from "./tutor.controller"
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";
import { asyncHandler } from "../../utils/asyncHandler";

const tutorRouter = Router()

tutorRouter.get('/tutors', asyncHandler(controllers.getTutorsController))
tutorRouter.get('/tutors/:id', asyncHandler(controllers.getTutorByIdController))
tutorRouter.patch('/tutor/profile', authenticate, checkRole("TUTOR"), asyncHandler(controllers.updateTutorProfileController))
tutorRouter.post('/tutor/availability', authenticate, checkRole("TUTOR"), asyncHandler(controllers.createAvailabilitySlotController))
tutorRouter.delete('/tutor/availability/:id', authenticate, checkRole("TUTOR"), asyncHandler(controllers.deleteAvailabilitySlotController))
tutorRouter.get('/categories', asyncHandler(controllers.getCategoriesController))

export default tutorRouter