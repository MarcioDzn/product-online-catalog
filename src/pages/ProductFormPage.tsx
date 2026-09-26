import { useContext, useEffect, useState, type ChangeEvent } from "react";
import FieldInput from "../components/FieldInput";
import FieldRichTextEditor from "../components/richText/FieldRichTextEditor";
import FieldImagePicker from "../components/imagePicker/FieldImagePicker";
import FieldSelect from "../components/select/FieldSelect";
import Button from "../components/Button";
import type { ProductFormData, ProductImage, ProductImageFormData } from "../types/Products";
import { createCategory, getCategories, getMyCategories } from "../services/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getProductById, updateProduct } from "../services/products";
import { productSchema } from "../schemas/productSchema";
import type z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { PageActionContext } from "../context/PageActionContext";

import toast from "react-hot-toast";
import { categorySchema } from "../schemas/categorySchema";

const MAX_IMAGES = 25

export default function ProductFormPage() {
    const queryClient = useQueryClient();

    const { setPageAction } = useContext(PageActionContext);
    
    const [productTitle, setProductTitle] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productStock, setProductStock] = useState("1")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("active");
    const [images, setImages] = useState<ProductImage[]>([])

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);


    function handleSetImages(newImages: ProductImage[]) {
        const selectedImages = newImages.slice(0, MAX_IMAGES - images.length);
        
        setImages(prev => [...prev, ...selectedImages]);
    }

    function handleRemoveImage(index: number) {
        const imageToRemove = images[index];
        const remainingImages = images.filter((_, i) => i !== index);

        if (imageToRemove?.is_cover && remainingImages.length > 0) {
            remainingImages[0] = {
                ...remainingImages[0],
                is_cover: true
            };
        }

        setImages(remainingImages);
    }

    const {
        data: categories = [],
        isLoading: isLoadingCategory,
        isError: isErrorCategory,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getMyCategories(),
    });

    const {
        data: product,
        isLoading: isLoadingProduct,
        isError: isErrorProduct,
    } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(Number(id)),
        enabled: isEditing,
    });

    const createProductMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (product) => {
            toast.success("Produto criado com sucesso!");
            navigate(`/admin/products/${product.id}`);
        },
        onError: (error) => {
            console.error("Erro ao criar produto:", error)
        },
    })

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,

        onSuccess: async (newCategory) => {
            toast.success("Categoria criada com sucesso!");

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setCategory(String(newCategory.id));
            setCategoryName("");
            setCategoryError("");
            setIsCategoryModalOpen(false);
        },

        onError: (error) => {
            setCategoryError(error.message);
        },
    });

    const updateProductMutation = useMutation({
        mutationFn: (data: ProductFormData) => updateProduct(Number(id), data),
        onSuccess: () => {
            toast.success("Produto editado com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao editar produto:", error)
        },
    })

    const isPending = isEditing 
        ? updateProductMutation.isPending 
        : createProductMutation.isPending;

    useEffect(() => {
        setPageAction({
            label: "Salvar",
            formId: "product-form",
            isPending: isPending,
        });

        return () => setPageAction(null);
    }, [isPending, setPageAction]);

    useEffect(() => {
        if (product) {
            setProductTitle(product.title);
            setProductPrice(String(product.price));
            setProductStock(String(product.stock));
            setDescription(product.description || "");
            setCategory(String(product.category.id));
            setStatus("active");
            setImages(product.images?.map((img) => ({
                id: img.id,
                url: img.url,
                is_cover: img.is_cover
            })) || []);
        }
    }, [product]);

    useEffect(() => {
        if (categories.length > 0 && !category) {
            setCategory(String(categories[0].id));
        }
    }, [categories, category]);

    if (isErrorProduct) {
        return (
            <p>Produto não encontrado</p>
        )
    }

    function getFieldErrors(error: z.ZodError): Record<string, string> {
        const errors: Record<string, string> = {}
        for (const issue of error.issues) {
            const key = issue.path[0]
            if (typeof key === "string" && !errors[key]) {
                errors[key] = issue.message
            }
        }
        return errors
    }

    function handleSelectCoverImage(index: number) {
        setImages(images.map((img, imgIndex) => {
            if (imgIndex == index) {
                return {
                    id: img.id,
                    url: img.url,
                    is_cover: true
                }
            }
            return {
                id: img.id,
                url: img.url,
                is_cover: false
            }
        }))
    }

    async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const validation = productSchema.safeParse({
            title: productTitle,
            description,
            price: productPrice,
            stock: productStock,
            category_id: category,
            status,
            images,
        })

        if (!validation.success) {
            setFieldErrors(getFieldErrors(validation.error))
            return
        }

        setFieldErrors({})

        const data = validation.data

        const payload: ProductFormData = {
            category_id: Number(data.category_id),
            title: data.title,
            description: data.description ?? "",
            price: data.price,
            is_visible: data.status === "active",
            stock: data.stock,
            images: data.images.map((image) => ({
                url: image.url,
                product_id: 0,
                is_cover: image.is_cover,
            })),
        }

        if (isEditing) {
            updateProductMutation.mutate(payload);
        } else {
            createProductMutation.mutate(payload);
        }
    }

    function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const validation = categorySchema.safeParse({
            name: categoryName,
        });

        if (!validation.success) {
            const errors = getFieldErrors(validation.error);

            setCategoryError(errors.name ?? "");
            return;
        }

        setCategoryError("");

        createCategoryMutation.mutate(validation.data);
    }

    return (
        <main>
            <form id="product-form" onSubmit={handleCreateProduct}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center w-full gap-4 pt-8">
                        <Button 
                            className="border border-gray-400 p-1 rounded-md cursor-pointer text-black bg-white hover:bg-gray-100"
                            type="button"
                            onClick={() => navigate("/admin/products")}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="size-6"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" 
                                />
                            </svg> 
                        </Button>
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-gray-900">{`${isEditing ? "Editar produto" : "Adicionar novo produto"}`}</h1>
                        </div>
                    </div>
                </div>

                <main className="w-full py-2 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-4 flex-2">
                        <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                            <FieldInput 
                                id="product-title"
                                label="Nome do produto"
                                placeholder="Exemplo: Camiseta 100% algodão"
                                value={productTitle}
                                onChange={setProductTitle}
                                error={fieldErrors.title}
                            />

                            <FieldRichTextEditor
                                id="description"
                                label="Descrição" 
                                value={description}
                                onChange={setDescription}
                            />
                        </div>


                        <div className="flex flex-col md:flex-row justify-between gap-4 border border-gray-200 rounded-lg p-4">
                            <div className="w-full">
                                <FieldInput 
                                    id="product-price"
                                    label="Preço"
                                    mode="currency"
                                    placeholder="R$ 10,00"
                                    value={productPrice}
                                    onChange={setProductPrice}
                                    error={fieldErrors.price}
                                />
                            </div>

                            <div className="w-full">
                                <FieldInput 
                                    id="product-stock"
                                    label="Quantidade em estoque"
                                    placeholder="Insira a quantidade em estoque"
                                    mode="integer"
                                    value={productStock}
                                    onChange={setProductStock}
                                    error={fieldErrors.stock}
                                />
                            </div>
                        </div>

                    </div>
                    

                    <div className="w-full h-fit flex flex-col flex-1 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <FieldSelect 
                                    id="product-status"
                                    label="Status"
                                    value={status}
                                    options={[
                                        {
                                            value: "active",
                                            text: "Ativo"
                                        },
                                        {
                                            value: "inactive",
                                            text: "Inativo"
                                        },
                                    ]}
                                    onChange={(
                                        e: ChangeEvent<HTMLSelectElement>, 
                                        status: string
                                    ) => setStatus(status)}
                            />
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <FieldSelect 
                                    id="product-category"
                                    label="Categoria"
                                    value={category}
                                    options={categories.map((category) => ({
                                        value:  String(category.id),
                                        text: category.name
                                    }))}
                                    onChange={(
                                        e: ChangeEvent<HTMLSelectElement>, 
                                        category: string
                                    ) => setCategory(category)}
                            />

                            <Button
                                type="button"
                                className="mt-3 w-full"
                                onClick={() => {
                                    setCategoryError("");
                                    setCategoryName("");
                                    setIsCategoryModalOpen(true);
                                }}
                            >
                                Criar categoria
                            </Button>

                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <FieldImagePicker
                                id="images"
                                label="Imagens"
                                images={images}
                                isDisabled={images.length === MAX_IMAGES}
                                error={fieldErrors.images}
                                handleRemoveImage={handleRemoveImage}
                                handleAddImages={handleSetImages}
                                handleSelectCoverImage={handleSelectCoverImage}
                            />
                        </div>
                    </div>
                </main>
            </form>

            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Criar categoria
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Informe o nome da nova categoria.
                            </p>
                        </div>

                        <form onSubmit={handleCreateCategory}>
                            <FieldInput
                                id="category-name"
                                label="Nome da categoria"
                                placeholder="Ex: Camisetas"
                                value={categoryName}
                                onChange={setCategoryName}
                                error={categoryError}
                            />

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        setIsCategoryModalOpen(false);
                                        setCategoryError("");
                                    }}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={createCategoryMutation.isPending}
                                    onClick={() => {}}
                                >
                                    {createCategoryMutation.isPending
                                        ? "Criando..."
                                        : "Criar categoria"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    )
}