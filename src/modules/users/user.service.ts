import type { User } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

/**
 * Fetches homepage data for unauthenticated visitors.
 * Returns all categories, the top 3 most-booked tutors (excluding banned users),
 * and the total platform counts for students and tutors.
 * Used to populate the landing page with live stats.
 */
export const getHomeStatsService = async () => {
    const categories = await prisma.category.findMany()
    const featuredTutors = await prisma.tutorProfile.findMany({
        take: 3,
        where: {
            user: { isBanned: false }
        },
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        include: {
            user: true,
            category: true,
            reviews: { select: { rating: true, id: true } }
        }
    })
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } })
    const totalTutors = await prisma.user.count({ where: { role: 'TUTOR' } })
    return {
        categories,
        featuredTutors,
        totalStudents,
        totalTutors
    }
}

/**
 * Fetches the full profile of the currently authenticated user.
 * Includes tutorProfile if the user is a tutor.
 * Sensitive fields like password and isBanned are already omitted globally by Prisma.
 */
export const getUserProfileService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tutorProfile: true }
    })

    if (!user) throw new ApiError(400, "User not found")
    if (user.id !== userId) throw new ApiError(401, "Cannot perform this action")

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tutorProfile: user.tutorProfile
    }
};

/**
 * Fetches dashboard stats for the currently authenticated user.
 * The response shape differs based on the user's role:
 *
 * TUTOR stats:
 *   - Total unique students taught
 *   - Total hours taught (from completed bookings)
 *   - Total earnings (hours × hourly rate)
 *   - Average rating across all reviews
 *   - Next 3 upcoming confirmed sessions
 *
 * STUDENT stats:
 *   - Number of active (confirmed) bookings
 *   - Total hours of completed sessions
 *   - Learning points (50 points per completed session, gamification)
 *   - Next 3 upcoming confirmed sessions
 */
export const getUserStatsService = async (userId: string, role: string) => {
    const now = new Date();

    if (role === 'TUTOR') {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId },
            include: {
                reviews: true,
                bookings: { include: { student: true } }
            }
        });

        if (!tutor) return null;

        const myBookings = tutor.bookings;
        const completedBookings = myBookings.filter(b => b.status === 'COMPLETED');
        const totalHours = completedBookings.reduce((acc, b) => acc + (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60), 0);
        const upcomingSessions = myBookings
            .filter(b => b.status === 'CONFIRMED' && new Date(b.startTime) > now)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 3)
            .map(b => ({
                id: b.id,
                studentName: b.student.name,
                startTime: b.startTime,
                endTime: b.endTime
            }));

        return {
            totalStudents: new Set(myBookings.map(b => b.studentId)).size,
            hoursTaught: Math.round(totalHours * 10) / 10,
            totalEarnings: Math.round(totalHours * tutor.hourlyRate),
            averageRating: tutor.reviews.length > 0 ? tutor.reviews.reduce((acc, r) => acc + r.rating, 0) / tutor.reviews.length : 0,
            upcomingSessions: upcomingSessions
        };
    }

    if (role === 'STUDENT') {
        const bookings = await prisma.booking.findMany({
            where: { studentId: userId },
            include: { tutor: { include: { user: true } }, category: true }
        });

        const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
        const totalHours = completedBookings.reduce((acc, b) => acc + (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60), 0);
        const nextSessions = bookings
            .filter(b => b.status === 'CONFIRMED' && new Date(b.startTime) > now)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 3)
            .map(b => ({
                id: b.id,
                title: b.category?.name || "Tutoring Session",
                tutorName: b.tutor.user.name,
                startTime: b.startTime,
                endTime: b.endTime
            }));

        return {
            activeBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
            completedHours: Math.round(totalHours * 10) / 10,
            learningPoints: completedBookings.length * 50,
            nextSessions: nextSessions
        };
    }

    return null;
};

/**
 * Updates the profile of the currently authenticated user.
 * Checks that the new email (if changed) is not already taken by another account.
 * Returns the updated user including their tutor profile if applicable.
 */
export const updateUserProfileService = async (userId: string, data: Partial<User>) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new ApiError(400, "User not found")
    if (user.id !== userId) throw new ApiError(401, "Cannot perform this action")

    if (user.email) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email! } })
        if (existingUser && existingUser.id !== userId) throw new ApiError(400, "Email already exists")
    }

    const result = await prisma.user.update({
        data: {
            ...data
        },
        where: {
            id: userId
        },
        include: { tutorProfile: true }
    })
    return {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        tutorProfile: result.tutorProfile
    }
};