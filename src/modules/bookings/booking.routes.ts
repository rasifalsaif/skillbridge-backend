import { Router } from "express";
import * as controllers from "./booking.controller"
import { authenticate } from "../../middlewares/authenticate";

const bookingRouter = Router()

bookingRouter.post('/bookings', authenticate, controllers.createBookingsController)
bookingRouter.get('/bookings', controllers.getBookingsController)
bookingRouter.patch('/bookings/:id/status', authenticate, controllers.changeBookingStatusController)

export default bookingRouter 