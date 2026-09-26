type Props = {
    name: string;
    className?: string;
};

export default function Avatar({
    name,
    className = "",
}: Props) {
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <div
            className={`
                flex
                items-center
                justify-center
                w-9
                h-9
                rounded-full
                bg-lime-400
                font-medium
                text-gray-900
                select-none
                ${className}
            `}
        >
            {initial}
        </div>
    );
}