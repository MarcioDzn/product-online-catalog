import ProductCardList from "../components/cards/ProductCardList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products";
import { useEffect, useState } from "react";
import type { Product } from "../types/Products";
import Accordion from "../components/accordion/Accordion";
import Divider from "../components/common/Divider";
import FieldRangeSlider from "../components/slider/FieldRangeSlider";
import AccordionSelectionItem from "../components/accordion/AccordionSelectionItem";
import { getCategories } from "../services/categories";
import { formatCurrency, maskCurrencyInput, parseCurrency } from "../utils/money";
import Select from "../components/select/Select";
import Button from "../components/button/Button";

function pricetext(price: number) {
  return `R$${price}`;
}

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const ITEMS_PER_PAGE = 20;

export default function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const categoryIds = searchParams.getAll("category_id");
    const page = Number(searchParams.get("page")) || 1;
    const currentSortFilter = searchParams.get("sort") ?? "default";

    const price = {
        minPrice: Number(searchParams.get("min_price")) || MIN_PRICE,
        maxPrice: Number(searchParams.get("max_price")) || MAX_PRICE
    };
    
    const [priceFilter, setPriceFilter] = useState<number[]>([    
        Math.min(price.minPrice, price.maxPrice),
        Math.max(price.minPrice, price.maxPrice)
    ]);

    const [isCategoryAccordionOpen, setIsCategoryAccordionOpen] = useState(true);
    const [isPriceAccordionOpen, setIsPriceAccordionOpen] = useState(true);
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

    const navigate = useNavigate();

    const handleProductClick = (id: number) => {
        navigate("/products/" + id);
    };

    const applyPriceFilter = () => {
        setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            params.set("min_price", String(priceFilter[0]));
            params.set("max_price", String(priceFilter[1]));

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
    };

    const handleCategorySelect = (categoryId: number) => {
        const params = new URLSearchParams(searchParams);

        if (categoryIds.includes(categoryId.toString())) {
            params.delete("category_id");

            categoryIds
                .filter(id => id !== categoryId.toString())
                .forEach(id => params.append("category_id", id));
        } else {
            params.append("category_id", categoryId.toString());
        }

        params.set("page", "1");

        setSearchParams(params);
    };

    const {
        data: categories = [],
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products", search, page, categoryIds, price, currentSortFilter],
        queryFn: () => getProducts(
            search, 
            categoryIds.map(categoryId => Number(categoryId)), 
            price,
            {
                minStock: 0,
                maxStock: 1000000
            },
            currentSortFilter,
            page, 
            ITEMS_PER_PAGE
        ),
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

    if (isLoading) {
        return <p>Carregando produtos...</p>;
    }

    if (isError) {
        return <p>Erro ao carregar produtos.</p>;
    }

    return (
        <main className="py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
                <div>
                    <h2 className="text-4xl font-bold mb-1">Produtos</h2>
                    <span className="block text-left text-md text-gray-600">
                        Resultados para: "<strong>{search}</strong>"
                    </span>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                    <button
                        onClick={() => setIsFilterMobileOpen(true)}
                        className="lg:hidden border border-gray-300 rounded-lg px-4 h-12 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                    >
                        Filtros
                    </button>

                    <span className="whitespace-nowrap text-sm text-gray-600">Ordenar por</span>
                    <Select
                        className="h-12"
                        value={currentSortFilter}  
                        options={[
                            { value: "default", text: "Mais relevantes" },
                            { value: "price_desc", text: "Maior Preço" },
                            { value: "price_asc", text: "Menor Preço" },
                            { value: "newest", text: "Mais recentes" },
                            { value: "oldest", text: "Mais antigos" }
                        ]}
                        onChange={handleSortChange}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {isFilterMobileOpen && (
                    <div 
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setIsFilterMobileOpen(false)}
                    />
                )}

                <aside className={`
                    fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white p-6 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out
                    ${isFilterMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:z-auto lg:h-auto lg:w-64 lg:max-w-64 lg:p-0 lg:shadow-none lg:overflow-visible
                `}>
                    <Button
                            onClick={() => setIsFilterMobileOpen(false)}
                            className="flex w-full z-50 justify-between items-center mb-6 bg-transparent text-black hover:bg-transparent p-0 lg:hidden"
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
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <ProductCardList 
                        products={products ? products?.products : [] as Product[]}
                        currentPage={page}
                        pageQuantity={products ? products?.total_pages : 0}
                        onPageChange={handlePageChange}
                        onProductClick={handleProductClick}
                    />
                </div>
            </div>
        </main>
    );
}