import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter valid email." }),
    username: z.string().regex(/^[a-z0-9_.]{1,15}$/, {
      message: "Invalid Username",
    }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    cnfPassword: z.string(),
  })
  .refine((data) => data.password === data.cnfPassword, {
    message: "Password does not match",
    path: ["cnfPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: z.string().regex(/^[a-z0-9_.]{1,15}$/, {
    message: "Invalid Username",
  }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
