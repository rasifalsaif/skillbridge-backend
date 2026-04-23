import type z from "zod";
import type { TutorProfile } from "../../generated/prisma/client";
import type { TutorProfileWhereInput } from "../../generated/prisma/models";
import prisma from "../../lib/prisma";
import type { QueryFilter } from "../../types/filters";
import { ApiError } from "../../utils/ApiError";
import type { AvailabilitySchema } from "./tutor.schema";

/**
 * Fetches a filtered list of tutor profiles.
 * Supports filtering by:
 *   - categoryId: only tutors in a specific subject category
 *   - minPrice / maxPrice: hourly rate range
 *   - searchTerm: matches against tutor name, email, or bio (case-insensitive)
 *
 * Banned tutors are always excluded from the results.
 */
export const getTutorsService = async (filters: QueryFilter) => {
    const { categoryId, minPrice, maxPrice, searchTerm } = filters

    const where: TutorProfileWhereInput = {
        user: { isBanned: false }
    }

    if (categoryId) {
        where.categoryId = categoryId
    }

    if (minPrice || maxPrice) {
        where.hourlyRate = {
            gte: minPrice || 0,
            lte: maxPrice || 9999999
        }
    }

    if (searchTerm) {
        where.OR = [
            { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
            { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
            { bio: { contains: searchTerm, mode: 'insensitive' } }
        ]
    }

    const tutors = await prisma.tutorProfile.findMany({
        where,
        include: {
            user: true,
            category: true,
            reviews: { select: { rating: true, id: true } },
            availabilitySlots: true
        }
    })
    return tutors
};

/**
 * Fetches a single tutor profile by their tutor profile ID.
 * Includes their user info, category, all reviews, and availability slots.
 * Returns 404 if the tutor doesn't exist or is banned.
 */
export const getTutorByIdService = async (tutorProfileId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            id: tutorProfileId,
            user: {
                isBanned: false
            }
        },
        include: {
            user: true,
            category: true,
            reviews: true,
            availabilitySlots: true
        }
    })
    if (!tutor) throw new ApiError(404, "Tutor not found")
    return tutor
};

/**
 * Updates the tutor profile (bio, hourlyRate, categoryId, etc.) for the logged-in tutor.
 * The userId from the JWT is used to find the correct profile — tutors can only edit their own.
 */
export const updateTutorProfileService = async (userId: string, data: Partial<TutorProfile>) => {
    const profile = await prisma.tutorProfile.update({
        data: data,
        where: { userId: userId }
    })
    return profile
};

/**
 * Adds a new availability slot to the tutor's calendar.
 *
 * - Looks up the tutor profile from the userId (from JWT).
 * - Rejects the slot if it overlaps with any existing slot (prevents double-booking).
 * - Overlap is checked with a "starts before end AND ends after start" query.
 */
export const createAvailabilitySlotService = async (userId: string, data: z.infer<typeof AvailabilitySchema>) => {
    const tutor = await prisma.tutorProfile.findUnique({ where: { userId: userId } })
    if (!tutor) throw new ApiError(400, "Invalid User ID")

    // Check for time conflicts with existing slots
    const slot = await prisma.availabilitySlot.findFirst({
        where: {
            tutorProfileId: tutor.id,
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime }
        }
    })
    if (slot) throw new ApiError(409, "Schedule Conflict: This time slot overlaps with an existing session in your calendar. Please pick a different slot.")

    await prisma.availabilitySlot.create({
        data: {
            tutorProfileId: tutor.id,
            ...data
        }
    })
};

/**
 * Deletes an availability slot from the tutor's calendar.
 *
 * - Only the tutor who owns the slot can delete it.
 * - Already-booked slots cannot be deleted (students have a confirmed booking on them).
 */
export const deleteAvailabilitySlotService = async (userId: string, slotId: string) => {
    const slot = await prisma.availabilitySlot.findUnique({
        where: { id: slotId },
        include: {
            tutor: { select: { userId: true } }
        }
    })

    if (!slot) throw new ApiError(404, "Slot doesn't exists")
    if (slot.tutor.userId !== userId) throw new ApiError(401, "Cannot perform this action")
    if (slot.isBooked) throw new ApiError(400, "Cannot delete already booked slot")

    await prisma.availabilitySlot.delete({ where: { id: slotId } })
};

/**
 * Returns all subject categories in the system.
 * Used to populate dropdowns and filter options across the frontend.
 */
export const getCategoriesService = async () => {
    const categories = await prisma.category.findMany()
    return categories
};