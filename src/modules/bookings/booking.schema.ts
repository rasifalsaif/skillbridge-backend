import z from "zod";
import { BookingStatus } from "../../generated/prisma/enums";

export const BookingSchema = z.object({
    studentId: z.uuid(),
    tutorProfileId: z.uuid(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    categoryId: z.uuid()
}).refine(data => data.startTime < data.endTime, {
    error: "startTime must be before endTime"
})

export const UpdateBookingSchema = z.strictObject({
    status: z.enum(BookingStatus)
})