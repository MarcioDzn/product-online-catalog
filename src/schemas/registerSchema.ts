import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Insira um nome válido"),

    email: z.email("Insira um endereço de e-mail válido"),

    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres"),

    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
