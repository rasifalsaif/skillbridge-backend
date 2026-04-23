import z from "zod";

export const ReviewSchema = z.object({
    tutorProfileId: z.uuid(),
    comment: z.string(),
    rating: z.number().min(0).max(5)
})