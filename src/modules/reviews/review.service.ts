import type z from "zod";
import type { ReviewSchema } from "./review.schema";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

/**
 * Creates a new review for a tutor profile.
 * The studentId is taken from the JWT (not the request body) to prevent spoofing.
 * Validates that the tutor profile being reviewed actually exists before creating the review.
 */
export const createReviewService = async (userId: string, data: z.infer<typeof ReviewSchema>) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: {
            id: data.tutorProfileId
        }
    })
    if (!tutorProfile) throw new ApiError(400, "Invalid tutor profile id")

    const review = await prisma.review.create({
        data: {
            studentId: userId,
            ...data
        }
    })
    return review
};

/**
 * Deletes a review by its ID.
 * Only the student who wrote the review is allowed to delete it (403 if not the owner).
 * Returns the deleted review data for confirmation.
 */
export const deleteReviewService = async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    })

    if (!review) throw new ApiError(404, "Review not found")
    if (review.studentId !== userId) throw new ApiError(403, "You are not authorized to delete this review")

    await prisma.review.delete({
        where: {
            id: reviewId
        }
    })
    return review
};
