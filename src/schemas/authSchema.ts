import { z } from "zod";

export const authSchema = z.object({
    login: z
        .string()
        .min(1, "Insira um endereço de e-mail válido"),
    password: z
        .string()
        .min(1, "Digite sua senha")
});

export type authSchemaInput = z.infer<typeof authSchema>;