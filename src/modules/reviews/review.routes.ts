import { Router } from "express";
import { createReviewController, deleteReviewController } from "./review.controller";
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";

const reviewRouter = Router()

reviewRouter.post('/review', authenticate, checkRole("STUDENT"), createReviewController)
reviewRouter.delete('/review/:id', authenticate, checkRole("STUDENT"), deleteReviewController)

export default reviewRouter