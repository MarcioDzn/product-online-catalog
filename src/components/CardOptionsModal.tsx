type HoverColor =
    | "hover:bg-gray-100"
    | "hover:bg-blue-50 hover:text-blue-600"
    | "hover:bg-red-50 hover:text-red-600";


type Option = {
    icon: React.ReactNode
    name: string
    hoverColor: HoverColor,
    onClick: () => void
}

type Props = {
    options: Option[]
}


export function CardOptionsModal({ options }: Props) {
    return (
        <div className="absolute top-8 left-4 z-50 rounded-md border border-gray-100 bg-white p-1.5 shadow-md">
            {options.map((option) => (
                <button
                    key={option.name}
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        option.onClick();
                    }}
                    
                    className={`flex w-full items-center justify-start gap-2 rounded px-2 py-1.5 text-smtransition-colors ${option.hoverColor} cursor-pointer`}
                >
                    {option.icon}
                    <span>{option.name}</span>
                </button>
            ))}
        </div>
    );
}