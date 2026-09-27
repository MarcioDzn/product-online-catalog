import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../button/Button";
import FieldInput from "../input/FieldInput";

import {
    createCategory,
    deleteCategory,
    getMyCategories,
} from "../../services/categories";

import { categorySchema } from "../../schemas/categorySchema";
import type { Category } from "../../types/Products";
import ConfirmModal from "./ConfirmModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onCategoryCreated: (category: Category) => void;
};

export default function CategoryManagerModal({
    isOpen,
    onClose,
    onCategoryCreated,
}: Props) {
    const queryClient = useQueryClient();

    const [categoryName, setCategoryName] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const {
        data: categories = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getMyCategories(),
        enabled: isOpen,
    });

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,

        onSuccess: async (newCategory) => {
            toast.success("Categoria criada com sucesso!");

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setCategoryName("");
            setCategoryError("");
            setCategoryToDelete(null);

            onCategoryCreated(newCategory);
        },

        onError: (error) => {
            setCategoryError(error.message);
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,

        onSuccess: async () => {
            toast.success("Categoria removida com sucesso!");

            setCategoryToDelete(null);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: (error) => {
            toast.error(error.message);
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

    function handleDeleteCategory(category: Category) {
        setCategoryToDelete(category);
    }

    function handleClose() {
        if (
            createCategoryMutation.isPending ||
            deleteCategoryMutation.isPending
        ) {
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
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Gerenciar categorias
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Crie ou remova categorias do seu catálogo.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleCreateCategory}
                    className="border-b border-gray-200 pb-6"
                >
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                        Nova categoria
                    </h3>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex-1">
                            <FieldInput
                                id="category-name"
                                label="Nome"
                                placeholder="Ex: Camisetas"
                                value={categoryName}
                                onChange={setCategoryName}
                                error={categoryError}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={createCategoryMutation.isPending}
                            onClick={() => {}}
                            className="sm:mt-7"
                        >
                            {createCategoryMutation.isPending
                                ? "Criando..."
                                : "Adicionar"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                        Categorias existentes
                    </h3>

                    {isLoading && (
                        <p className="text-sm text-gray-500">
                            Carregando categorias...
                        </p>
                    )}

                    {isError && (
                        <p className="text-sm text-red-600">
                            Não foi possível carregar as categorias.
                        </p>
                    )}

                    {!isLoading && !isError && categories.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Nenhuma categoria cadastrada.
                        </p>
                    )}

                    {!isLoading && !isError && categories.length > 0 && (
                        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0"
                                >
                                    <span className="text-sm text-gray-800">
                                        {category.name}
                                    </span>

                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteCategory(category)
                                        }
                                        disabled={
                                            deleteCategoryMutation.isPending
                                        }
                                        className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="button"
                        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        onClick={handleClose}
                    >
                        Fechar
                    </Button>
                </div>
            </div>

            <ConfirmModal
                isOpen={categoryToDelete !== null}
                title="Excluir categoria?"
                message={
                    categoryToDelete
                        ? `Tem certeza que deseja excluir a categoria "${categoryToDelete.name}"? Essa ação não pode ser desfeita.`
                        : ""
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isPending={deleteCategoryMutation.isPending}
                onCancel={() => {
                    if (!deleteCategoryMutation.isPending) {
                        setCategoryToDelete(null);
                    }
                }}
                onConfirm={() => {
                    if (categoryToDelete) {
                        deleteCategoryMutation.mutate(categoryToDelete.id);
                    }
                }}
            />

        </div>
    );
}
