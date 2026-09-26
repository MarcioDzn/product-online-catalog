import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Insira o nome da categoria")
});

export type CategorySchemaInput = z.infer<typeof categorySchema>;