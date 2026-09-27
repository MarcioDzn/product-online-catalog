import type { CategoryFormData } from "../types/Category";
import type { Category } from "../types/Products";

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getCategories(
    search: string = "",
): Promise<Category[]> {
    const url =
        `${import.meta.env.VITE_API_URL}/categories?name=${search}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
    }

    return response.json();
}

export async function getMyCategories(
    search: string = "",
): Promise<Category[]> {
    const url =
        `${import.meta.env.VITE_API_URL}/categories/me?name=${search}`;

    const response = await fetch(url, {
        headers: {
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
    }

    return response.json();
}

export async function createCategory(
    data: CategoryFormData
): Promise<Category> {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ?? "Erro ao criar categoria"
        );
    }

    return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
        {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (!response.ok) {
        let message = `Erro ao excluir categoria: ${response.status}`;

        try {
            const error = await response.json();

            if (error.detail) {
                message = error.detail;
            }
        } catch {
            // resposta sem JSON
        }

        throw new Error(message);
    }
}
