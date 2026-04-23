import { Router } from "express";
import * as controllers from "./booking.controller"
import { authenticate } from "../../middlewares/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";

const bookingRouter = Router()

bookingRouter.post('/bookings', authenticate, asyncHandler(controllers.createBookingsController))
bookingRouter.get('/bookings', asyncHandler(controllers.getBookingsController))
bookingRouter.patch('/bookings/:id/status', authenticate, asyncHandler(controllers.changeBookingStatusController))

export default bookingRouter 