import { useNavigate } from "react-router-dom";
import SearchInput from "../input/SearchInput";
import { useState } from "react";
import Navbar from "./Navbar";


export default function SearchNavbar() {
    const [search, setSearch] = useState("")
    const navigate = useNavigate();

    const handleSearch = (
        e: React.SubmitEvent<HTMLFormElement>, 
        search: string
    ) => {
        e.preventDefault()

        navigate(
            `/products?search=${encodeURIComponent(search)}`
        );
    }

    return (
        <>
            <Navbar>
                <div className="w-full flex  mx-auto max-w-2xl">
                    <SearchInput value={search} placeholder="Buscar produtos..." onChange={setSearch} handleSearch={handleSearch}/>
                </div>
            </Navbar>
        </>
    )
}