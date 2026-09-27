import type { AuthData } from "../types/Auth";

export async function auth(data: AuthData) {
    const formData = new URLSearchParams();

    formData.append("username", data.login);
    formData.append("password", data.password);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(error.detail ?? "Erro ao fazer login");
    }

    return response.json();
}
