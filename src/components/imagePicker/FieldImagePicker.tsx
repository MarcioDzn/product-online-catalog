import type { ProductImage } from "../../types/Products"
import ImagePicker from "./ImagePicker"

type Props = {
    id: string
    label: string
    images: ProductImage[]
    isDisabled: boolean
    error: string
    handleRemoveImage: (index: number) => void
    handleAddImages: (images: ProductImage[]) => void
    handleSelectCoverImage: (index: number) => void
}

export default function FieldImagePicker({ 
    id, 
    label, 
    images, 
    isDisabled,
    error,
    handleAddImages, 
    handleRemoveImage,
    handleSelectCoverImage
}: Props) {

    return (
        <div className="flex flex-col gap-2 h-full">
            <label 
                htmlFor={id} 
                className="text-sm font-medium text-gray-700">
                    {label}
            </label>

            <span className="text-sm text-red-600">
                {error}
            </span>

            <div className="flex flex-col gap-4 h-full">
                <div className="
                    flex-1
                    grid
                    grid-cols-3
                    sm:grid-cols-3
                    lg:grid-cols-5
                    gap-3
                ">
                    {images.map((img, index) => (
                        <div
                            className={
                                `group relative min-h-0 min-w-0 w-full aspect-square overflow-hidden rounded-lg bg-gray-100 ${img.is_cover && "border-2"}`}
                            onClick={() => handleSelectCoverImage(index)}
                            key={`${img.id}-${index}`}
                        >
                            {img.is_cover && (
                                <span className="absolute top-1.5 left-1.5 z-20 bg-gray-50 text-black text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shadow-sm pointer-events-none">
                                    Capa
                                </span>
                            )}

                            <div 
                                className="relative w-full h-full bg-gray-500 z-11 opacity-0 group-hover:opacity-20 transition-opacity"
                            />
                            <button
                                type="button"
                                className="
                                    flex justify-center items-center
                                    opacity-100
                                    lg:opacity-0
                                    lg:group-hover:opacity-100
                                    absolute right-1 top-1 z-20
                                    cursor-pointer rounded-lg
                                    w-7 h-7
                                    bg-white shadow-sm
                                    transition-opacity
                                "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                }}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="size-4 text-gray-700"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" 
                                    />
                                </svg>
                            </button>
                            <img
                                src={img.url}
                                alt={`Imagem ${img.id + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    ))}

                    {!isDisabled && (
                        <div className="min-h-0 min-w-0 w-full aspect-square overflow-hidden rounded-lg">
                            <ImagePicker
                                description=""
                                isDisabled={isDisabled}
                                onChange={(urls: string[]) => {
                                    const hasCover = images.some((img) => img.is_cover);

                                    const newImagesObjects = urls.map((url, index) => ({
                                        id: 0,
                                        url,
                                        is_cover: !hasCover && index === 0
                                    } as ProductImage));

                                    handleAddImages(newImagesObjects);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}