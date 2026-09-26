import type { Product, ProductFormData, ProductResponse } from "../types/Products";

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getProducts(
    search: string = "",
    categoryIds: number[],
    price: { minPrice: number, maxPrice: number },
    stock: { minStock: number, maxStock: number },
    sort: string,
    page: number,
    pageSize: number
): Promise<ProductResponse> {
    const url =
        "http://localhost:8000/products/me?title=" + search +
        "&page=" + page +
        "&page_size=" + pageSize +
        categoryIds
            .map(categoryId => `&category_ids=${categoryId}`)
            .join("") +
        "&min_price=" + price.minPrice +
        "&max_price=" + price.maxPrice +
        "&min_stock=" + stock.minStock +
        "&max_stock=" + stock.maxStock +
        `${sort === "default" || !sort ? "" : "&sort=" + sort}`;

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    return response.json();
}

export async function getProductById(
    id: number
): Promise<Product> {
    const url = "http://localhost:8000/products/" + id;

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar produto");
    }

    return response.json();
}

export async function createProduct(
    data: ProductFormData
): Promise<Product> {
    const response = await fetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();

        console.error("STATUS:", response.status);
        console.error("ERRO DA API:", error);
        console.error("DADOS ENVIADOS:", data);

        throw new Error(`Erro ao criar produto: ${response.status}`);
    }

    return response.json();
}

export async function updateProduct(
    id: number,
    data: ProductFormData
): Promise<Product> {
    const response = await fetch(
        "http://localhost:8000/products/" + id,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error("STATUS:", response.status);
        console.error("ERRO DA API:", error);
        console.error("DADOS ENVIADOS:", data);

        throw new Error(`Erro ao editar produto: ${response.status}`);
    }

    return response.json();
}

export async function deleteProduct(
    id: number,
): Promise<Product> {
    const response = await fetch(
        "http://localhost:8000/products/" + id,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error("STATUS:", response.status);
        console.error("ERRO DA API:", error);

        throw new Error(`Erro ao excluir produto: ${response.status}`);
    }

    return response.json();
}
