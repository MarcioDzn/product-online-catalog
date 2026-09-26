export type ProductImage = {
    id: number
    url: string
    is_cover: boolean
}

export type Category = {
    id: number
    name: string
}

export type Product = {
    id: number
    images: ProductImage[]
    title: string;
    description: string;
    category: Category;
    stock: number;
    price: number;
    created_at: string
    user_id: number
}

export type ProductResponse = {
  total_pages: number
  total_items: number
  products: Product[]
}

export interface ProductImageFormData {
  id?: number
  url: string;
  product_id: number;
  is_cover?: boolean;
}

export interface ProductFormData {
  category_id: number;
  title: string;
  description?: string | null;
  price: number;
  is_visible?: boolean;
  stock?: number;
  images?: ProductImageFormData[];
}