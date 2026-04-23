import { Router } from "express";
import * as controllers from "./tutor.controller"
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";

const tutorRouter = Router()

tutorRouter.get('/tutors', controllers.getTutorsController)
tutorRouter.get('/tutors/:id', controllers.getTutorByIdController)
tutorRouter.patch('/tutor/profile', authenticate, checkRole("TUTOR"), controllers.updateTutorProfileController)
tutorRouter.post('/tutor/availability', authenticate, checkRole("TUTOR"), controllers.createAvailabilitySlotController)
tutorRouter.delete('/tutor/availability/:id', authenticate, checkRole("TUTOR"), controllers.deleteAvailabilitySlotController)
tutorRouter.get('/categories', controllers.getCategoriesController)

export default tutorRouter