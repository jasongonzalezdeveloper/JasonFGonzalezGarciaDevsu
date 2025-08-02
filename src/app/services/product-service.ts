import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { catchError, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { handleHttpError } from './handle-http-error';
import { ProductResponse } from './product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';
  private productList : Product[] = [];

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductResponse> {
    if(this.productList.length > 0) {
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

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(handleHttpError)
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError(handleHttpError)
    );
  }

  deleteProduct(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

  existProduct(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`).pipe(
      catchError(handleHttpError)
    );
  }

}
