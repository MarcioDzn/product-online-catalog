import type { User } from "../types/Users";

export async function getUserById(
    id: number
): Promise<User> {
    const url = `${import.meta.env.VITE_API_URL}/users/` + id;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar usuário");
    }

    return response.json();
}
