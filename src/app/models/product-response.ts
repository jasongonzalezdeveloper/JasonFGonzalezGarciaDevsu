import { Product } from "./product";

export interface ProductResponse {
   data: Product[];
}

export interface ProductResponseWithPagination {
   data: Product[];
   totalPages: number;
   totalProducts: number;
}