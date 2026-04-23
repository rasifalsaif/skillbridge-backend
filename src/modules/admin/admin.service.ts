import { Role } from "../../generated/prisma/enums";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

/**
 * Returns platform-wide analytics for the admin dashboard.
 * Runs 3 count queries in parallel using Promise.all for efficiency.
 * Returns total students, total tutors, and total bookings ever made.
 */
export const analyticsService = async () => {
    const [studentCount, tutorCount, bookingCount] = await Promise.all([
        prisma.user.count({ where: { role: Role.STUDENT } }),
        prisma.user.count({ where: { role: Role.TUTOR } }),
        prisma.booking.count()
    ])
    return {
        totalStudents: studentCount,
        totalTutors: tutorCount,
        totalBookings: bookingCount
    }
};

/**
 * Fetches all users on the platform except the currently logged-in admin.
 * Results include each user's tutor profile (with category and review ratings if they have one),
 * the isBanned field (hidden elsewhere but visible to admins),
 * and are sorted by most recently created first.
 */
export const getUsersService = async (userId: string) => {
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: userId  // Exclude the admin themselves from the list
            }
        },
        include: {
            tutorProfile: {
                include: {
                    category: true,
                    reviews: { select: { rating: true } },
                }
            },
        },
        omit: {
            isBanned: false  // Override global omit so admins can see ban status
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return users
};

/**
 * Bans or unbans a user by ID.
 * Pass action="BAN" to ban or action="UNBAN" to restore access.
 * Banned users cannot log in and their profiles are hidden from public views.
 */
export const moderateUserService = async (userId: string, action: "BAN" | "UNBAN") => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new ApiError(400, "User not found")
    await prisma.user.update({
        data: {
            isBanned: action === "BAN",
        },
        where: {
            id: userId
        }
    })
};

/**
 * Creates a new subject category (e.g. "Math", "English", "Programming").
 * Categories are used to classify tutors and filter search results.
 */
export const createCategoryService = async (name: string) => {
    const category = await prisma.category.create({
        data: {
            name
        }
    })
    return category
};

/**
 * Updates the name of an existing category by its ID.
 */
export const updateCategoryService = async (id: string, name: string) => {
    const category = await prisma.category.update({
        data: {
            name
        },
        where: {
            id
        }
    })
    return category
};

/**
 * Deletes a category by its ID.
 * Tutors linked to this category will have their categoryId set to null (SetNull on delete).
 */
export const deleteCategoryService = async (id: string) => {
    const category = await prisma.category.delete({
        where: {
            id
        }
    })
    return category
};