import type { RegisterData } from "../types/Register";

export async function register(data: RegisterData) {
    const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        console.log("Erro da API:", responseData);

        const message =
            responseData.detail?.[0]?.msg ??
            "Erro ao cadastrar usuário";

        throw new Error(
            message.replace(/^Value error,\s*/, "")
        );
    }

    return responseData;
}
