import {z} from "zod";

// Auth 
export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});


export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});



// Room 
export const CreateRoomSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9-]+$/), //// only lowercase, numbers, hyphens — safe for URLs
});