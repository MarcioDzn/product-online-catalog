import Select from "./Select"

type Option = {
    value: string
    text: string
}

type Props = {
    id: string
    label: string
    value: string,
    options: Option[],
    onChange: (value: string) => void
}

export default function FieldSelect({ 
    id, 
    label, 
    value, 
    options,
    onChange
}: Props) {
    return (
        <div className="flex flex-col gap-2 h-full">
            <label 
                htmlFor={id} 
                className="text-sm font-medium text-gray-700">
                    {label}
            </label>
            
            <Select
                value={value}
                options={options}
                onChange={onChange}
            />
        </div>
    )
}