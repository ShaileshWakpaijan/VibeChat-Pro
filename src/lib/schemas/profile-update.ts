import { z } from "zod";

export const usernameUpdateSchema = z.object({
  username: z.string().regex(/^[a-z0-9_.]{1,15}$/, {
    message: "Invalid Username",
  }),
});

export type UsernameUpdateSchema = z.infer<typeof usernameUpdateSchema>;

export const updatePasswordSchema = z
  .object({
    oldPass: z.string().min(6, { message: "Minimum 6 characters required" }),
    newPass: z.string().min(6, { message: "Minimum 6 characters required" }),
    cnfPass: z.string(),
  })
  .refine((data) => data.newPass === data.cnfPass, {
    message: "Password does not match",
    path: ["cnfPass"],
  });

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
