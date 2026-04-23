import { Router } from "express";
import { createReviewController, deleteReviewController } from "./review.controller";
import { authenticate } from "../../middlewares/authenticate";
import { checkRole } from "../../middlewares/checkRole";
import { asyncHandler } from "../../utils/asyncHandler";

const reviewRouter = Router()

reviewRouter.post('/review', authenticate, checkRole("STUDENT"), asyncHandler(createReviewController))
reviewRouter.delete('/review/:id', authenticate, checkRole("STUDENT"), asyncHandler(deleteReviewController))

export default reviewRouter