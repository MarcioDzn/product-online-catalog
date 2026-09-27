import type { MouseEventHandler, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    text?: string
    children?: ReactNode
    type?: "button" | "submit"
    className?: string
    formId?: string
    disabled?: boolean
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function Button({ 
    text, 
    children, 
    type = "button", 
    className, 
    formId,
    disabled,
    onClick 
}: Props) {
    return (
        <button 
            type={type}
            onClick={onClick}
            form={formId}
            disabled={disabled}
            className={twMerge(
                "border border-transparent cursor-pointer bg-black py-2.5 px-4 font-medium text-white rounded-lg text-sm hover:bg-gray-700",
                className
            )}
        >
                {children ?? text}
        </button>
    )
}