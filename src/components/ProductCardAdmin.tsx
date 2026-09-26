import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "../types/Products";
import { formatCurrency } from "../utils/money";
import { CardOptionsModal } from "./CardOptionsModal";
import { formatRelativeDate } from "../utils/time";

type Props = {
    id: number;
    image: ProductImage | undefined;
    title: string;
    description: string;
    price: number;
    created_at: string;
    category: string;
    stock: number;
    onDeleteClick: (id: number) => void;
    onUpdateClick: (id: number) => void;
};

export default function ProductCardAdmin({
    id,
    image,
    title,
    description,
    price,
    created_at,
    category,
    stock,
    onDeleteClick,
    onUpdateClick,
}: Props) {
    const [optionOpened, setOptionOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOptionOpened(false);
            }
        }

        if (optionOpened) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [optionOpened]);

    return (
        <div className="group flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3.5 rounded-lg p-3 transition-all bg-white hover:shadow-sm">
            {/* Bloco 1: Imagem e Textos Principais */}
            <div className="flex w-full sm:w-auto flex-1 items-center gap-3 min-w-0">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                    {image ? (
                        <img src={image.url} alt={title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400 text-center p-1">
                            Sem foto
                        </div>
                    )}
                </div>

                <div className="flex flex-col min-w-0 justify-center">
                    <h3 className="truncate text-sm font-bold text-gray-800 leading-tight">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-600 shrink-0">
                            {category}
                        </span>
                        <span className="truncate text-xs text-gray-500" title={description}>
                            {description}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bloco 2: Valores, Controles e Ações */}
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:gap-5 border-t border-gray-100 sm:border-0 pt-2.5 sm:pt-0">
                
                {/* Dados Principais */}
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Preço</span>
                        <span className="text-xs font-bold text-gray-900">{formatCurrency(price)}</span>
                    </div>

                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Estoque</span>
                        <span className="text-xs font-semibold text-gray-700">{stock} un</span>
                    </div>

                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Criado</span>
                        <span className="text-xs text-gray-600">{formatRelativeDate(created_at)}</span>
                    </div>
                </div>

                {/* Divisor Visual */}
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                {/* Controles: Menu */}
                <div className="flex items-center gap-3 shrink-0">
                    <div ref={menuRef} className="relative">
                        <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOptionOpened((prev) => !prev);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5 .75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5 .75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5 .75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>

                        {optionOpened && (
                            <div className="absolute right-0 top-0 z-50 min-w-36">
                                <CardOptionsModal
                                    options={[
                                        {
                                            name: "Editar",
                                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>,
                                            onClick: () => { onUpdateClick(id); setOptionOpened(false); },
                                        },
                                        {
                                            name: "Remover",
                                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
                                            onClick: () => { onDeleteClick(id); setOptionOpened(false); },
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}