import { useState } from "react";
import FieldInput from "../components/input/FieldInput";
import type { ZodError } from "zod";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/button/Button";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/registerSchema";
import type { RegisterData } from "../types/Register";
import { register } from "../services/register";


export default function AdminRegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: (data: RegisterData) => register(data),

        onSuccess: async () => {
            setRegisterError("");
            setRegisterSuccess(true);

            setTimeout(() => {
                navigate("/admin/");
            }, 2000);
        },

        onError: (error) => {
            setRegisterError(error.message);
            setPassword("")
            setConfirmPassword("")
        },
    });


    function getFieldErrors(error: ZodError): Record<string, string> {
        const errors: Record<string, string> = {};

        for (const issue of error.issues) {
            const key = issue.path[0];

            if (typeof key === "string" && !errors[key]) {
                errors[key] = issue.message;
            }
        }

        return errors;
    }

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setRegisterError("");

        const validation = registerSchema.safeParse({
            name,
            email,
            password,
            phone,
            confirmPassword,
        });

        if (!validation.success) {
            setFieldErrors(getFieldErrors(validation.error));
            return;
        }

        setFieldErrors({});

        const { 
            name: nameRegister, 
            email: emailRegister, 
            password: passwordRegister,
            phone: phoneRegister
        } = validation.data;

        console.log(validation.data)

        const phoneFormatted = `+${phoneRegister.replace(/\D/g, "")}`;
        console.log(phoneFormatted)

        registerMutation.mutate({
            name: nameRegister,
            email: emailRegister,
            password: passwordRegister,
            phone: phoneFormatted
        });
    }

    return (
        <main className="min-h-screen flex mt-32 sm:mt-0 items-start sm:items-center justify-center">



            <div className="flex flex-col gap-8 w-lg shadow-xl p-8 rounded-xl">

                {registerSuccess && (
                    <div className="flex flex-row items-center gap-2 w-full border rounded-lg border-green-300 bg-green-50 p-4 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                            />
                        </svg>

                        <span className="text-sm text-green-700">
                            Conta criada com sucesso! Redirecionando...
                        </span>
                    </div>
                )}
            
                <div>
                    <h1 className="text-2xl font-bold">
                        Cadastrar-se
                    </h1>
                    <span className="text-sm text-gray-600">
                        Cadastre-se no sistema
                    </span>
                </div>

                <form id="register-form" onSubmit={handleRegister}>
                    <div className="flex flex-col gap-2 w-full">

                        {registerError && (
                            <div className="flex flex-row items-center gap-2 w-full border rounded-lg border-red-300 bg-red-50 p-4 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-sm">
                                    {registerError}
                                </span>
                            </div>
                        )}

                        
                        <FieldInput 
                            id="name"
                            label="Nome"
                            placeholder=""
                            value={name}
                            onChange={setName}
                            error={fieldErrors.name}
                        />

                        <FieldInput 
                            id="email"
                            label="E-mail"
                            placeholder=""
                            value={email}
                            onChange={setEmail}
                            error={fieldErrors.email}
                        />

                        <FieldInput 
                            id="phone"
                            label="Número do WhatsApp"
                            placeholder="+55 (75) 99999-9999"
                            value={phone}
                            onChange={setPhone}
                            error={fieldErrors.phone}
                            mode="phone"
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

                        <FieldInput 
                            id="confirm-password"
                            label="Confirmar Senha"
                            type="password"
                            placeholder=""
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            error={fieldErrors.confirmPassword}
                        />

                        <Button
                            type="submit"
                            formId="register-form"
                            onClick={() => {}}
                        >
                            Cadastrar-se
                        </Button>

                    </div>
                </form>
            </div>
        </main>
    )
}