import SelectButton from "../button/SelectButton"

type Props = {
    id: number
    value: string
    checked: boolean
    onChange: (id: number) => void
}

export default function AccordionSelectionItem({
    id,
    value, 
    checked,
    onChange
}: Props) {
    return (
        <div className="flex items-center gap-2">
            <SelectButton
                checked={checked}
                onChange={() => onChange(id)}
            />

            <span>{value}</span>
        </div>
    )
}