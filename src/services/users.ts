export async function getMe() {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Não autenticado");
    }

    return response.json();
}
