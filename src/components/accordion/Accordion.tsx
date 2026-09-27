type Props = {
    title: string
    children: React.ReactNode
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function Accordion({ 
    title, 
    children,
    isOpen,
    setIsOpen,
}: Props) {
    return (
        <div className="flex flex-col gap-2 items-start w-full">
            <div 
                className="flex justify-between items-center gap-2 w-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold">{title}</span>

                {
                    isOpen ? 
                    <div 
                        className="cursor-pointer"
                        
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="size-5"
                        >
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="m4.5 15.75 7.5-7.5 7.5 7.5" 
                            />
                        </svg>
                    </div>
                    :
                    <div 
                        className="cursor-pointer"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="size-5"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="m19.5 8.25-7.5 7.5-7.5-7.5" 
                            />
                        </svg>
                    </div>
                }
            </div>

            <div
                className={`
                    w-full overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isOpen 
                        ? "max-h-96 opacity-100" 
                        : "max-h-0 opacity-0"
                    }
                `}
            >
                {
                    children
                }
            </div>
        </div>
    )
}