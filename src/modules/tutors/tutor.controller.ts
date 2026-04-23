import type { NextFunction, Request, Response } from "express";
import { getTutorByIdService, getTutorsService, createAvailabilitySlotService, deleteAvailabilitySlotService, updateTutorProfileService, getCategoriesService } from "./tutor.service";
import { AvailabilitySchema, UpdateTutorProfileSchema } from "./tutor.schema";
import type { TutorProfile } from "../../generated/prisma/client";

/**
 * GET /api/tutors
 * Returns a filtered list of tutors based on optional query params:
 *   ?categoryId=   ?minPrice=   ?maxPrice=   ?searchTerm=
 * Public endpoint — no authentication required.
 */
export const getTutorsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            categoryId: req.query.categoryId as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            searchTerm: req.query.searchTerm as string,
        }

        const result = await getTutorsService(filters)

        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * GET /api/tutors/:id
 * Returns a single tutor's full profile including reviews and availability slots.
 * Public endpoint — no authentication required.
 */
export const getTutorByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tutorProfileId = req.params.id as string
        const result = await getTutorByIdService(tutorProfileId)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * PATCH /api/tutors/profile  (requires authentication, TUTOR only)
 * Updates the logged-in tutor's profile fields (bio, hourlyRate, categoryId, etc.).
 */
export const updateTutorProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = UpdateTutorProfileSchema.parse(req.body)
        const result = await updateTutorProfileService(req.user!.userId, validatedData as TutorProfile)
        res.json({
            success: true,
            message: "Profile updated successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
};

/**
 * POST /api/tutors/availability  (requires authentication, TUTOR only)
 * Adds a new time slot to the tutor's availability calendar.
 * Rejects if the slot overlaps with an existing one.
 */
export const createAvailabilitySlotController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = AvailabilitySchema.parse(req.body)
        await createAvailabilitySlotService(req.user!.userId, validatedData)
        res.status(201).json({
            success: true,
            message: "Availability Slot Added"
        })
    } catch (error) {
        next(error)
    }
};

/**
 * DELETE /api/tutors/availability/:id  (requires authentication, TUTOR only)
 * Removes an availability slot from the tutor's calendar.
 * Cannot delete a slot that has already been booked by a student.
 */
export const deleteAvailabilitySlotController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slotId = req.params.id as string
        await deleteAvailabilitySlotService(req.user!.userId, slotId)
        res.json({
            success: false,
            message: "Slot deleted successfully"
        })
    } catch (error) {
        next(error)
    }
};

/**
 * GET /api/categories
 * Returns all subject categories. Used to populate dropdowns/filters.
 * Public endpoint — no authentication required.
 */
export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getCategoriesService()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
};