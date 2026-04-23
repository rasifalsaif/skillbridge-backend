import z from "zod";

export const UpdateTutorProfileSchema = z.strictObject({
    bio: z.string().optional(),
    hourlyRate: z.number().min(0).optional(),
    categoryId: z.uuid().optional()
})

export const AvailabilitySchema = z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date()
}).refine(data => data.startTime < data.endTime, {
    error: "startTime must be before endTime"
})