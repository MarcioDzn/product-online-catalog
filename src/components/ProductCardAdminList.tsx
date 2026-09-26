import { useState } from "react"
import type { Category, Product } from "../types/Products"
import Select from "./select/Select"
import ProductCardAdmin from "./ProductCardAdmin"
import SelectButton from "./SelectButton"
import Pagination from "./pagination/Pagination"
import SearchInput from "./SearchInput"
import { useNavigate } from "react-router-dom"

type Props = {
    products: Product[]
    maxProductsPerPage: number
    currentPage: number
    pageQuantity: number
    onPageChange: (page: number) => void
    onDeleteClick: (id: number) => void
    onUpdateClick: (id: number) => void
}

export default function ProductCardAdminList({ 
    products, 
    maxProductsPerPage, 
    currentPage,
    pageQuantity,
    onPageChange,
    onDeleteClick, 
    onUpdateClick 
}: Props) {
    const [search, setSearch] = useState("")

    const navigate = useNavigate();

    const handleSearch = (
        e: React.SubmitEvent<HTMLFormElement>, 
        search: string
    ) => {
        e.preventDefault();

        const params = new URLSearchParams(location.search);

        if (search) {
            params.set('search', search);
        } else {
            params.delete('search'); 
        }

        navigate(`/admin/products?${params.toString()}`);
    }

    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
        new Set()
    );
    
    function toggleAllProducts() {
        setSelectedProducts((current) => {
            const allSelected = visiblePageProducts.every((product) =>
                current.has(product.id)
            );

            if (allSelected) {
                return new Set();
            }

            return new Set(visiblePageProducts.map((product) => product.id));
        });
    }


    const visiblePageProducts = products.slice(0, maxProductsPerPage);

    const allSelected =
        visiblePageProducts.length > 0 &&
        visiblePageProducts.every((product) => selectedProducts.has(product.id));

    const someSelected =
        visiblePageProducts.some((product) => selectedProducts.has(product.id));

    return (
        <div className="w-full">
            <div className="rounded-2xl border border-gray-200 bg-white">
                {/* Toolbar */}
                <div className="flex flex-col-reverse gap-4 min-[480px]:flex-row min-[480px]:items-center justify-end border-b border-gray-100 px-4 py-3">
                    <div className="flex flex-row gap-2">
                        <SearchInput 
                            value={search} 
                            placeholder="Buscar produtos..." 
                            onChange={setSearch} 
                            handleSearch={handleSearch}/>
                    </div>

                </div>

                {/* Produtos */}
                {products.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                        Nenhum produto encontrado.
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-gray-100">
                        {visiblePageProducts.map((product) => (
                            <ProductCardAdmin
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                description={product.description}
                                price={product.price}
                                created_at={product.created_at}
                                stock={product.stock}
                                category={product.category.name}
                                image={product.images.find((image) => image.is_cover)}
                                onDeleteClick={onDeleteClick}
                                onUpdateClick={onUpdateClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Paginação */}
            <div className="mt-4 flex w-full justify-center">
                <Pagination
                    pageQuantity={pageQuantity}
                    maxVisiblePages={5}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}