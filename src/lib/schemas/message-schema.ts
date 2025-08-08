import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message is too long"),
});

export type MessageInput = z.infer<typeof messageSchema>;
