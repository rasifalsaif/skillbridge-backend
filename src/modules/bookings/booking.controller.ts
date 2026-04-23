import type { NextFunction, Request, Response } from "express";
import { changeBookingStatusService, createBookingsService, getBookingsService } from "./booking.service";
import { BookingSchema, UpdateBookingSchema } from "./booking.schema";

/**
 * POST /api/bookings  (requires authentication, STUDENT only)
 * Creates a new booking for a student with a tutor.
 * Validates the request body and checks for slot availability and scheduling conflicts.
 */
export const createBookingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = BookingSchema.parse(req.body)
        await createBookingsService(validatedData)
        res.status(201).json({
            success: true,
            message: "Session Booked Successfully"
        })
    } catch (error) {
        next(error)
    }
};

/**
 * GET /api/bookings  (requires authentication, ADMIN only)
 * Returns all bookings on the platform for admin review.
 * Excludes bookings involving banned users.
 */
export const getBookingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getBookingsService()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * PATCH /api/bookings/:id  (requires authentication)
 * Allows the student to cancel or the tutor to mark a booking as completed.
 * The booking ID comes from the URL param, and the new status comes from the request body.
 */
export const changeBookingStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id as string
        const validatedData = UpdateBookingSchema.parse(req.body)
        const result = await changeBookingStatusService(req.user!, bookingId, validatedData)
        res.json({
            success: true,
            message: "Booking Status Updated Successfully",
            data: {
                status: result
            }
        })
    } catch (error) {
        next(error)
    }
};