import Input from "./Input"


type Props = {
    id: string
    label: string
    value: string,
    placeholder: string,
    error: string
    mode?: "integer" | "float" | "currency" | "phone"
    type?: "text" | "password"
    onChange: (value: string) => void
}

export default function FieldInput({ 
    id, 
    label, 
    value, 
    placeholder, 
    error,
    mode, 
    type = "text",
    onChange 
}: Props) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
                <label 
                    htmlFor={id} 
                    className="text-sm font-medium text-gray-700">
                        {label}
                    
                </label>

                
                <Input 
                    id={id} 
                    value={value} 
                    type={type}
                    placeholder={placeholder} 
                    mode={mode}
                    onChange={onChange}
                        className={`
                            rounded-lg
                            px-2 py-2
                            border
                            outline-none
                            transition-all duration-200
                            ${
                                error
                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            }
                        `}
                    />
            </div>


            <span className="text-sm text-red-600">
                {error}
            </span>
        </div>
    )
}