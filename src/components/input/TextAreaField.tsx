type Props = {
    id: string
    label: string
    value: string
    placeholder: string
    error?: string
    rows?: number
    onChange: (value: string) => void
}

export default function TextAreaField({
    id,
    label,
    value,
    placeholder,
    error,
    rows = 8,
    onChange
}: Props) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>

                <textarea
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    rows={rows}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full
                        resize-y
                        rounded-lg
                        px-3 py-2
                        border
                        outline-none
                        transition-all duration-200
                        text-sm
                        ${
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }
                    `}
                />
            </div>

            {error && (
                <span className="text-sm text-red-600">
                    {error}
                </span>
            )}
        </div>
    )
}
