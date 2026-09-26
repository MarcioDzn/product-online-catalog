import type { RegisterData } from "../types/Register";

export async function register(data: RegisterData) {
    const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(error.detail ?? "Erro ao cadastrar novo usuário");
    }

    return response.json();
}