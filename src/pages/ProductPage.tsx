import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/products";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "../utils/money";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Divider from "../components/Divider";
import { getUserById } from "../services/user";
import Avatar from "../components/Avatar";

const MAX_THUMBNAIL = 5;
const MAX_THUMBNAIL_MOBILE = 4;

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [imageIndex, setImageIndex] = useState(0);
    const [thumbnailStart, setThumbnailStart] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    const {
        data: product,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(Number(id)),
    });

    const {
        data: user,
    } = useQuery({
        queryKey: ["user", product?.user_id],
        queryFn: () => getUserById(product!.user_id),
        enabled: !!product?.user_id,
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1000px)");

        const handleChange = () => {
            setIsMobile(mediaQuery.matches);
        };

        handleChange();
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const maxThumbnail = isMobile
        ? MAX_THUMBNAIL_MOBILE
        : MAX_THUMBNAIL;

    const orderedImages = [
        ...(product?.images?.filter((img) => img.is_cover) ?? []), 
        ...(product?.images?.filter((img) => !img.is_cover) ?? []),
    ];

    const totalImages = orderedImages.length;
    
    // recalcula o início das miniaturas sempre que mudar entre mobile/desktop ou total de imagens
    useEffect(() => {
        if (!product) return;
        
        const middleOffset = Math.floor(maxThumbnail / 2);
        let newStart = imageIndex - middleOffset;
        const maxStart = Math.max(0, totalImages - maxThumbnail);

        if (newStart < 0) {
            newStart = 0;
        } else if (newStart > maxStart) {
            newStart = maxStart;
        }

        setThumbnailStart(newStart);
    }, [isMobile, totalImages, imageIndex, product, maxThumbnail]);

    if (isLoading) return <span>Carregando...</span>;
    if (isError || !product) return <span>Produto não encontrado</span>;



    const changeImage = (newIndex: number) => {
        setImageIndex(newIndex);
        
        const middleOffset = Math.floor(maxThumbnail / 2);
        let newStart = newIndex - middleOffset;
        
        const maxStart = Math.max(0, totalImages - maxThumbnail);
        
        if (newStart < 0) {
            newStart = 0;
        } else if (newStart > maxStart) {
            newStart = maxStart;
        }
        
        setThumbnailStart(newStart);
    };
    

    return (
        <main className="py-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
                <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start w-full min-w-0">
                    <div className="flex flex-row md:flex-col items-center justify-center my-auto gap-2 shrink-0 w-full md:w-auto">

                        <div className="flex flex-row md:flex-col gap-2 overflow-hidden">
                            {orderedImages
                                .slice(thumbnailStart, thumbnailStart + maxThumbnail)
                                .map((img) => {
                                    const index = orderedImages.findIndex(
                                        (image) => image.id === img.id
                                    );

                                    return (
                                        <div
                                            key={img.id}
                                            onClick={() => changeImage(index)}
                                            className={`relative w-20  min-[1000px]:w-24 aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer shrink-0
                                                ${
                                                    index === imageIndex
                                                        ? "border-2 border-black"
                                                        : "opacity-50 hover:opacity-100"
                                                }
                                            `}
                                        >
                                            <img
                                                src={img.url}
                                                alt="Miniatura"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="relative max-w-128 mx-auto min-[780px]:max-w-none w-full flex-1  aspect-3/4 rounded-lg overflow-hidden bg-gray-100 min-w-0 select-none">
                        <img
                            src={orderedImages[imageIndex]?.url}
                            alt="Imagem principal"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />

                        {totalImages > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium tracking-wide select-none">
                                {imageIndex + 1} / {totalImages}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-6 w-full min-w-0">
                    <div>
                        <span>
                            <Link
                                to={`/products`}
                                className="hover:underline"
                            >
                                Produtos
                            </Link>
                        </span>
                        <span>
                            {" > "}
                        </span>
                        <span>
                            <Link
                                to={`/products?category_id=${product.category.id}`}
                                className="hover:underline"
                            >
                                {product.category.name}
                            </Link>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Avatar name={user?.name ?? ""} />
                        <span>{user?.name}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl lg:text-3xl font-bold">{product.title}</h1>
                        <span className="text-xl lg:text-2xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                        </span>
                    </div>
                    
                    {product.description && (
                        <>
                            <Divider />

                            <div>
                                <div className="whitespace-pre-wrap">
                                    {product.description}
                                </div>
                            </div>
                        </>
                    )}
                    
                    <Divider />

                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://wa.me/${user?.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Olá, ${user?.name}! Gostaria de saber mais informações sobre ${product.title}, de${formatCurrency(product.price)}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-500 bg-white text-green-500 hover:text-white hover:bg-green-500 transition-colors rounded-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            Chamar no WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}