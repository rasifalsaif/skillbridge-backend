import type z from "zod";
import type { BookingSchema, UpdateBookingSchema } from "./booking.schema";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { JwtPayload } from "../../types/jwtPayload";

/**
 * Creates a new booking for a student.
 *
 * Validation steps before creating:
 * 1. Checks the selected time slot exists and belongs to the tutor.
 * 2. Rejects if the slot is already booked by another student.
 * 3. Checks for conflicts with the student's own existing bookings.
 *
 * On success, uses a transaction to:
 * - Create the booking record
 * - Mark the availability slot as booked (so no one else can book it)
 */
export const createBookingsService = async (data: z.infer<typeof BookingSchema>) => {
    // Verify the slot exists and is still available
    const slot = await prisma.availabilitySlot.findFirst({
        where: {
            tutorProfileId: data.tutorProfileId,
            startTime: data.startTime,
            endTime: data.endTime
        },
        select: {
            id: true,
            isBooked: true
        }
    })
    if (!slot) throw new ApiError(400, "Invalid Time Slot: The selected time slot is no longer available. Please refresh the page and try again.")
    if (slot.isBooked) throw new ApiError(400, "Slot is already booked")

    // Make sure the student doesn't already have a booking at this time
    const existingBooking = await prisma.booking.findFirst({
        where: {
            studentId: data.studentId,
            status: "CONFIRMED",
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime }
        }
    })
    if (existingBooking) throw new ApiError(400, "Booking Conflict: You already have another session scheduled during this time. Please check your dashboard and pick a different slot.")

    // Create booking and lock the slot atomically
    await prisma.$transaction(async tx => {
        await tx.booking.create({
            data: data
        })

        await tx.availabilitySlot.update({
            where: {
                id: slot.id
            },
            data: {
                isBooked: true
            }
        })
    })
};

/**
 * Returns all bookings on the platform, excluding any that involve banned users.
 * Includes student details, tutor info with reviews, and the session category.
 * Intended for admin use or internal dashboard views.
 */
export const getBookingsService = async () => {
    const bookings = await prisma.booking.findMany({
        where: {
            student: {
                isBanned: false
            },
            tutor: {
                user: {
                    isBanned: false
                }
            }
        },
        include: {
            student: true,
            tutor: {
                include: {
                    user: true,
                    reviews: true
                }
            },
            category: true
        }
    })
    return bookings
};

/**
 * Changes the status of a booking (CONFIRMED → COMPLETED or CANCELLED).
 *
 * Role-based status rules:
 * - Students can only CANCEL a booking.
 * - Tutors can only mark a booking as COMPLETED.
 * - A completed booking cannot be cancelled, and a cancelled booking cannot be completed.
 * - Only the student or tutor involved in the booking can update it.
 */
export const changeBookingStatusService = async (user: JwtPayload, bookingId: string, data: z.infer<typeof UpdateBookingSchema>) => {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) throw new ApiError(400, "Invalid Booking ID")

    // Students can only cancel
    if (user.role === "STUDENT" && data.status !== "CANCELLED") {
        throw new ApiError(401, "Cannot perform this action")
    }

    // Tutors can only mark as completed
    if (user.role === "TUTOR" && data.status !== "COMPLETED") {
        throw new ApiError(401, "Cannot perform this action")
    }

    if (data.status === "CANCELLED" && booking.status === "COMPLETED") {
        throw new ApiError(400, "Cannot cancel a completed booking")
    }

    if (data.status === "COMPLETED" && booking.status === "CANCELLED") {
        throw new ApiError(400, "Cannot complete a cancelled booking")
    }

    const tutor = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } })

    // Ensure only the involved student or tutor can change the booking
    if (booking.studentId !== user.userId && booking.tutorProfileId !== tutor?.id) {
        throw new ApiError(401, "Cannot perform this action")
    }

    const result = await prisma.booking.update({
        data: data,
        where: {
            id: bookingId
        },
        select: {
            status: true
        }
    })
    return result
};