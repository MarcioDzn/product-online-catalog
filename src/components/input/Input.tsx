import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { formatCurrency } from "../../utils/money"
import { applyMask, getInputModeFor, type InputMaskMode } from "../../utils/mask"

type Props = {
    id?: string
    value: string
    placeholder: string
    mode?: InputMaskMode
    type?: "text" | "password"
    onChange: (value: string) => void
    className?: string
    onBlur?: () => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function Input({
    id,
    value,
    placeholder,
    mode,
    type = "text",
    onChange,
    className,
    onBlur,
    onKeyDown,
}: Props) {
    const handleChange = (rawValue: string) => {
        onChange(applyMask(mode, rawValue))
    }

    const inputMode = useMemo(() => getInputModeFor(mode), [mode])

    const displayValue = useMemo(() => {
        if (mode !== "currency" || !value) return value

        const numericValue = Number(value)
        return isNaN(numericValue) ? value : formatCurrency(numericValue)
    }, [mode, value])

    return (
        <input
            id={id}
            className={twMerge(
                "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder-gray-500 focus:border-black [&::-webkit-search-cancel-button]:appearance-none",
                className
            )}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    )
}