import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getMyProducts } from "../services/products";
import ProductCardAdminList from "../components/cards/ProductCardAdminList";
import Button from "../components/button/Button";
import { useEffect, useState} from "react";
import { getMyCategories } from "../services/categories";
import Accordion from "../components/accordion/Accordion";
import FieldRangeSlider from "../components/slider/FieldRangeSlider";
import { formatCurrency, maskCurrencyInput, parseCurrency } from "../utils/money";
import Select from "../components/select/Select";
import type { Product } from "../types/Products";
import Divider from "../components/common/Divider";
import AccordionSelectionItem from "../components/accordion/AccordionSelectionItem";

function pricetext(price: number) {
  return `R$${price}`;
}

function stocktext(price: number) {
  return `${price}`;
}

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const MIN_STOCK = 0;
const MAX_STOCK = 200;

const ITEMS_PER_PAGE = 6

export default function AdminDashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient(); 

    const search = searchParams.get("search") ?? "";
    const categoryIds = searchParams.getAll("category_id");
    const page = Number(searchParams.get("page")) || 1;
    const currentSortFilter = searchParams.get("sort") ?? "default";

    const price = {
        minPrice: Number(searchParams.get("min_price")) || MIN_PRICE,
        maxPrice: Number(searchParams.get("max_price")) || MAX_PRICE
    }
    const [priceFilter, setPriceFilter] = useState<number[]>([    
        Math.min(price.minPrice, price.maxPrice),
        Math.max(price.minPrice, price.maxPrice)
    ])

    const stock = {
        minStock: Number(searchParams.get("min_stock")) || MIN_STOCK,
        maxStock: Number(searchParams.get("max_stock")) || MAX_STOCK
    }
    const [stockFilter, setStockFilter] = useState<number[]>([    
        Math.min(stock.minStock, stock.maxStock),
        Math.max(stock.minStock, stock.maxStock)
    ])

    const [isCategoryAccordionOpen, setIsCategoryAccordionOpen] = useState(true)
    const [isPriceAccordionOpen, setIsPriceAccordionOpen] = useState(true)
    const [isStockAccordionOpen, setIsStockAccordionOpen] = useState(true)
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

    const navigate = useNavigate();

    const applyPriceFilter = () => {
        setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            params.set("min_price", String(priceFilter[0]));
            params.set("max_price", String(priceFilter[1]));

            setSearchParams(params);
        }, 1000);
    };

    const applyStockFilter = () => {
        setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            params.set("min_stock", String(stockFilter[0]));
            params.set("max_stock", String(stockFilter[1]));

            setSearchParams(params);
        }, 1000);
    };

    const handlePageChange = (page: number) => {
        setSearchParams((current) => {
            current.set("page", String(page));
            return current;
        });
    };



    const handleSortChange = (
        value: string
    ) => {
        const params = new URLSearchParams(searchParams);

        params.set("sort", value);
        params.set("page", "1");

        setSearchParams(params);
    };
    

    const handlePriceFilter = (newPrice: number[]) => {
        setPriceFilter(newPrice);
    }

    const handleStockFilter = (newStock: number[]) => {
        setStockFilter(newStock);
    }


    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products", search, page, categoryIds, price, stock, currentSortFilter],
        queryFn: () => 
            getMyProducts(
                search, 
                categoryIds.map(categoryId => Number(categoryId)), 
                price,
                stock,
                currentSortFilter,
                page, 
                ITEMS_PER_PAGE
            ),
    });

    const {
        data: categories = [],
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getMyCategories(),
    });

    useEffect(() => {
        if (!products) return;

        if (page > products.total_pages && products.total_pages > 0) {
            setSearchParams((current) => {
                current.set("page", String(products.total_pages));
                return current;
            });
        }
    }, [products, page, setSearchParams]);

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            console.error("Erro ao remover produto:", error)
        },
    })

    if (isLoading) {
        return <p>Carregando produtos...</p>;
    }

    if (isError) {
        return <p>Erro ao carregar produtos.</p>;
    }



    const handleProductDeleteClick = (product_id: number) => {
        deleteProductMutation.mutate(product_id)
    };

    const handleProductUpdateClick = (product_id: number) => {
        navigate(String(product_id))
    };

    const handleCategorySelect = (categoryId: number) => {
        const params = new URLSearchParams(searchParams)

        if (categoryIds.includes(categoryId.toString())) {
            params.delete("category_id")

            categoryIds
                .filter(id => id !== categoryId.toString())
                .forEach(id => params.append("category_id", id))
        } else {
            params.append("category_id", categoryId.toString())
        }

        params.set("page", "1")

        setSearchParams(params)
    }

    return (
        <main>     
            <div className="flex flex-col">
                <div>
                    <h2 className="font-bold text-4xl pt-8">
                        Produtos
                    </h2>
                    <p>
                        {products?.total_items} produtos encontrados.
                    </p>
                </div>

                <div className="w-full flex items-center mb-4">
                    <div className="flex w-full flex-row gap-2 min-[480px]:items-center justify-between min-[480px]:justify-end mt-2">
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsFilterMobileOpen(true)}
                                    className="lg:hidden border border-gray-300 rounded-lg px-4 h-12 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                                >
                                    Filtros
                                </button>
                                <span className="whitespace-nowrap hidden lg:block">Ordenar por</span>
                                <Select
                                    className="h-12"
                                    value={currentSortFilter}  
                                    options={[
                                        {
                                            value: "default",
                                            text: "Mais relevantes"  
                                        },
                                        {
                                            value: "price_desc",
                                            text: "Maior Preço"  
                                        },
                                        {
                                            value: "price_asc",
                                            text: "Menor Preço"  
                                        },
                                        {
                                            value: "stock_asc",
                                            text: "Menor Estoque"  
                                        },
                                        {
                                            value: "stock_desc",
                                            text: "Maior Estoque"  
                                        },
                                        {
                                            value: "newest",
                                            text: "Mais recentes"  
                                        },
                                        {
                                            value: "oldest",
                                            text: "Mais antigos"  
                                        }
                                ]}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>
                            

                        <Button
                            type="button"
                            onClick={() => navigate("/admin/products/new")}
                            className="h-11 px-4 sm:px-5 rounded-xl shadow-sm text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor" 
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            <span className="hidden min-[480px]:inline">Adicionar produto</span>
                        </Button>
                    </div>

                </div>

                <div className="flex flex-row gap-8">
                    {isFilterMobileOpen && (
                        <div 
                            className="fixed inset-0 z-40 lg:hidden"
                            onClick={() => setIsFilterMobileOpen(false)}
                        />
                    )}

                    <aside className={`
                        fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white p-6 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out
                        ${isFilterMobileOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:translate-x-0 lg:static lg:z-auto lg:h-auto lg:w-96 lg:max-w-64 lg:p-0 lg:shadow-none lg:overflow-visible
                    `}>
                        <Button
                            onClick={() => setIsFilterMobileOpen(false)}
                            className="flex w-full justify-between items-center mb-6 bg-transparent text-black hover:bg-transparent p-0 lg:hidden"
                        >
                            <h3 className="text-xl font-bold">Filtros</h3>
                            <span className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1">
                                &times;
                            </span>
                        </Button>

                        <div className="flex flex-col gap-4">
                            <Accordion
                                title="Categorias"
                                isOpen={isCategoryAccordionOpen}
                                setIsOpen={setIsCategoryAccordionOpen}
                            >
                                {
                                    categories.map((category) => ({
                                        id: category.id,
                                        text: category.name
                                    }))
                                    .map((item) => (
                                        <AccordionSelectionItem 
                                            key={item.id}
                                            id={item.id}
                                            value={item.text}
                                            checked={categoryIds.map((categoryId) => Number(categoryId)).includes(item.id)}
                                            onChange={handleCategorySelect}
                                        />
                                    ))
                                }
                            </Accordion>

                            <Divider />

                            <Accordion
                                title="Preço"
                                isOpen={isPriceAccordionOpen}
                                setIsOpen={setIsPriceAccordionOpen}
                            >
                                <FieldRangeSlider 
                                    value={priceFilter}
                                    min={MIN_PRICE}
                                    max={MAX_PRICE}
                                    valuetext={pricetext}
                                    onChange={handlePriceFilter}
                                    onApply={applyPriceFilter}
                                    valueFormatter={formatCurrency}
                                    valueParser={parseCurrency} 
                                    maskInput={maskCurrencyInput}
                                />
                            </Accordion>

                            <Divider />

                            <Accordion
                                title="Estoque"
                                isOpen={isStockAccordionOpen}
                                setIsOpen={setIsStockAccordionOpen}
                            >
                                <FieldRangeSlider 
                                    value={stockFilter}
                                    min={MIN_STOCK}
                                    max={MAX_STOCK}
                                    valuetext={stocktext}
                                    onChange={handleStockFilter}
                                    onApply={applyStockFilter}
                                />
                            </Accordion>
                        </div>
                    </aside>
                    
                    <ProductCardAdminList 
                        products={products ? products?.products : [] as Product[]}
                        maxProductsPerPage={ITEMS_PER_PAGE}
                        currentPage={page}
                        pageQuantity={products ? products?.total_pages : 0}
                        onPageChange={handlePageChange}
                        onDeleteClick={handleProductDeleteClick}
                        onUpdateClick={handleProductUpdateClick}
                    />
                </div>
            </div>
            
            
        </main>
    )
}