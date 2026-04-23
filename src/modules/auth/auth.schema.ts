import * as z from "zod"
import { Role } from "../../generated/prisma/enums"

export const UserSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(Role),
    tutorProfile: z.object({
        bio: z.string(),
        hourlyRate: z.number(),
        categoryId: z.string()
    }).optional()
})

export const UpdateUserSchema = UserSchema.omit({ tutorProfile: true, password: true }).partial()

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const PasswordChangeSchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6)
})
