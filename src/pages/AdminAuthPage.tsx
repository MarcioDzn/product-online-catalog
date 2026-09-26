import { useState } from "react";
import FieldInput from "../components/FieldInput";
import type z from "zod";
import { authSchema } from "../schemas/authSchema";
import type { AuthData } from "../types/Auth";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../services/auth";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function AdminAuthPage() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [authError, setAuthError] = useState("");

    const { refreshUser } = useAuth();

    const navigate = useNavigate();

    const authMutation = useMutation({
        mutationFn: (data: AuthData) => auth(data),

        onSuccess: async (data) => {
            // TODO: adicionar cookies ao invés de localStorage
            localStorage.setItem("access_token", data.access_token);

            await refreshUser();

            setAuthError("");
            navigate("/admin/products")
        },

        onError: (error) => {
            setAuthError(error.message);
            setPassword("")
        },
    });


    function getFieldErrors(error: z.ZodError): Record<string, string> {
        const errors: Record<string, string> = {}
        for (const issue of error.issues) {
            const key = issue.path[0]
            if (typeof key === "string" && !errors[key]) {
                errors[key] = issue.message
            }
        }
        return errors
    }

    async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setAuthError("");

        const validation = authSchema.safeParse({
            login,
            password,
        });

        if (!validation.success) {
            setFieldErrors(getFieldErrors(validation.error));
            return;
        }

        setFieldErrors({});

        authMutation.mutate(validation.data);
    }

    return (
        <main className="min-h-screen flex mt-32 sm:mt-0 items-start sm:items-center justify-center">
            <div className="flex flex-col gap-8 w-lg shadow-xl p-8 rounded-xl">
                <div>
                    <h1 className="text-2xl font-bold">
                        Fazer Login
                    </h1>
                    <span className="text-sm text-gray-600">
                        Faça login no sistema
                    </span>
                </div>

                <form id="auth-form" onSubmit={handleAuth}>
                    <div className="flex flex-col gap-2 w-full">

                        {authError && (
                            <div className="flex flex-row items-center gap-2 w-full border rounded-lg border-red-300 bg-red-50 p-4 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-sm">
                                    {authError}
                                </span>
                            </div>
                        )}

                        
                        <FieldInput 
                            id="login"
                            label="E-mail"
                            placeholder=""
                            value={login}
                            onChange={setLogin}
                            error={fieldErrors.login}
                        />

                        <FieldInput 
                            id="password"
                            label="Senha"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={setPassword}
                            error={fieldErrors.password}
                        />

                        <Button
                            type="submit"
                            formId="auth-form"
                            onClick={() => {}}
                        >
                            Entrar
                        </Button>

                        <div className="text-center text-sm text-gray-600 mt-2">
                            Não possui uma conta?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                            >
                                Registre-se
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}