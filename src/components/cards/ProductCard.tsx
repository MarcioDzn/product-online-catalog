import { formatCurrency } from "../../utils/money";
import type { ProductImage } from "../../types/Products";


type Props = {
    id: number
    image: ProductImage | undefined;
    title: string;
    description: string;
    price: number;
    onProductClick: (id: number) => void
}

export default function ProductCard({ 
    id,
    image, 
    title,
    price,
    onProductClick
}: Props) {
    return (
        <div 
            onClick={(e) => {
                e.stopPropagation()
                onProductClick(id)
            }}
            className="flex flex-col gap-4 w-full overflow-hidden bg-white pb-4"
        >
            <div className="group aspect-3/4 relative w-full overflow-hidden rounded-xl flex justify-center items-center cursor-pointer">

                {
                    image &&                 
                    <img 
                        src={image.url} 
                        alt="Imagem do Produto" 
                        className="h-full w-auto max-w-none transition-transform duration-300 group-hover:scale-105"
                    />
                }

            </div>
            
            <div className="group flex flex-col cursor-pointer">
                <h1 className="relative w-fit font-semibold text-md leading-tight">
                    {title}

                    <span className="absolute left-0 -bottom-0.5 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </h1>
                <span className="text-md">
                    {formatCurrency(price)}
                </span>
            </div>
        </div>
    )
}