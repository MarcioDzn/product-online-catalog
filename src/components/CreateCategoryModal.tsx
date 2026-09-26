import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "./Button";
import FieldInput from "./FieldInput";

import { createCategory } from "../services/categories";
import { categorySchema } from "../schemas/categorySchema";
import type { Category } from "../types/Products";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
};

export default function CreateCategoryModal({
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const queryClient = useQueryClient();

    const [categoryName, setCategoryName] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,

        onSuccess: async (newCategory) => {
            toast.success("Categoria criada com sucesso!");

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setCategoryName("");
            setCategoryError("");

            onSuccess(newCategory);
            onClose();
        },

        onError: (error) => {
            setCategoryError(error.message);
        },
    });

    function handleCreateCategory(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const validation = categorySchema.safeParse({
            name: categoryName,
        });

        if (!validation.success) {
            const nameError = validation.error.issues.find(
                (issue) => issue.path[0] === "name"
            );

            setCategoryError(nameError?.message ?? "");
            return;
        }

        setCategoryError("");

        createCategoryMutation.mutate(validation.data);
    }

    function handleClose() {
        if (createCategoryMutation.isPending) {
            return;
        }

        setCategoryName("");
        setCategoryError("");
        onClose();
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Criar categoria
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Informe o nome da nova categoria.
                    </p>
                </div>

                <form onSubmit={handleCreateCategory}>
                    <FieldInput
                        id="category-name"
                        label="Nome da categoria"
                        placeholder="Ex: Camisetas"
                        value={categoryName}
                        onChange={setCategoryName}
                        error={categoryError}
                    />

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={createCategoryMutation.isPending}
                            onClick={() => {}}
                        >
                            {createCategoryMutation.isPending
                                ? "Criando..."
                                : "Criar categoria"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
