import { useState } from "react";

type Props = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export default function Toggle({ checked, onChange }: Props) {
    const [internalChecked, setInternalChecked] = useState(false);

    const isChecked = checked ?? internalChecked;

    function handleToggle() {
        const newValue = !isChecked;

        if (checked === undefined) {
            setInternalChecked(newValue);
        }

        onChange?.(newValue);
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            // Tamanho reduzido para h-5 w-9 (20x36px)
            className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                isChecked ? "bg-black" : "bg-gray-300"
            }`}
        >
            <span
                // Bolinha ajustada para h-4 w-4, com posição inicial de 2px (left-0.5 e top-0.5)
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                    isChecked ? "translate-x-4" : "translate-x-0"
                }`}
            />
        </button>
    );
}