import { z } from "zod";

export const authSchema = z.object({
    email: z.string().email({message: "Please enter valid email."}),
    password: z.string().min(6, {message: "Minimum 6 characters required"})
})

export type AuthSchema = z.infer<typeof authSchema>;