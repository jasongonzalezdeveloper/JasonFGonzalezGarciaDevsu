import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { catchError, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { handleHttpError } from './handle-http-error';
import { ProductResponse, ProductResponseForm, ProductResponseWithPagination } from '../models/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';
  private productList: Product[] = [];

  constructor(private http: HttpClient) { }

  getProducts(refresh: boolean): Observable<ProductResponse> {
    if (this.productList.length > 0 && !refresh) {
      return of({ data: this.productList });
    } else {
      return this.http.get<ProductResponse>(this.apiUrl).pipe(
        map(response => {
          this.productList = response.data;
          return { data: this.productList };
        }),
        shareReplay(1),
        catchError(handleHttpError)
      );
    }
  }

  getProductsByPage(page: number, quantityPerPage: number, searchTerm: string, refresh: boolean): Observable<ProductResponseWithPagination> {
    return this.getProducts(refresh).pipe(
      map(response => {
        const filteredData = response.data.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return {
          totalProducts: filteredData.length,
          data: filteredData.slice((page - 1) * quantityPerPage, page * quantityPerPage),
          totalPages: Math.ceil(filteredData.length / quantityPerPage)
        };
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

  createProduct(product: Product): Observable<ProductResponseForm> {
    return this.http.post<ProductResponseForm>(this.apiUrl, product).pipe(
      catchError(handleHttpError)
    );
  }

  updateProduct(product: Product): Observable<ProductResponseForm> {
    return this.http.put<ProductResponseForm>(`${this.apiUrl}/${product.id}`, product).pipe(
      catchError(handleHttpError)
    );
  }

  deleteProduct(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

  isProductValid(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

}
