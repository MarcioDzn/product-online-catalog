import type { ChangeEvent} from "react";
import { twMerge } from "tailwind-merge";

type Option = {
    value: string
    text: string
}

type Props = {
    value: string;
    options: Option[]
    onChange: (e: ChangeEvent<HTMLSelectElement>, value: string) => void;
    className?: string
};

export default function Select({ value, options, onChange, className }: Props) {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e, e.target.value)}
                className={twMerge(
                    "cursor-pointer appearance-none rounded-lg w-full h-full border border-gray-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition focus:border-gray-400",
                    className
                )}
            >
                {
                    options.map((option) =>
                        <option key={option.value} value={option.value}>{option.text}</option>
                    )
                }
            </select>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
            </svg>
        </div>
    );
}