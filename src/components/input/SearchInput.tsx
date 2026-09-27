import Input from "./Input"

type Props = {
    value: string
    placeholder: string
    onChange: (value: string) => void
    handleSearch: (e: React.SubmitEvent<HTMLFormElement>, search: string) => void
}

export default function SearchInput({ value, placeholder, onChange, handleSearch }: Props) {
    return (
        <form className="flex w-full" onSubmit={(e) => handleSearch(e, value)}>
            <div className="relative w-full flex items-center">
                <Input value={value} placeholder={placeholder} onChange={onChange}/>

                <div className="absolute right-4 flex flex-row-reverse gap-2">
                    <button
                        className="right-4 h-fit cursor-pointer"
                        type="submit"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="size-5">
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>

                    {value && 
                        <button
                            className="right-4 h-fit cursor-pointer"
                            type="button"
                            onClick={() => onChange("")}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" viewBox="0 0 24 24" 
                                strokeWidth={1.5} stroke="currentColor" 
                                className="size-5">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    }
                </div>
            </div>
        </form>
    )
}