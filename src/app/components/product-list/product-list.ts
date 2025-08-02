import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'product-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [ProductService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {

  products$: Observable<Product[]> = of([]);
  isProductsLoading$ = new BehaviorSubject<boolean>(false);
  searchTerm: string = '';
  currentPage = 1;
  totalPages = 0;
  quantityPerPage = 5;
  totalProducts = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.isProductsLoading$.next(false);
    this.productService.getProductsByPage(this.currentPage, this.quantityPerPage, this.searchTerm).pipe(
      map(products => products)
    ).subscribe({
      next: (products) => {
        this.totalProducts = products.totalProducts;
        this.totalPages = products.totalPages;
        this.isProductsLoading$.next(true);
        this.products$ = of(products.data);
      }
    });
  }

  searchProducts(term: string): void {
    if (this.products$ && term) {
      this.searchTerm = term;
    } else {
      this.searchTerm = '';
      this.currentPage = 1;
    }
    this.getProducts();
  }

  addProduct():void {
    this.router.navigate(['/add-product']);
  }

  previousPage(): void {
    if( this.currentPage <= 1) return;
    this.currentPage--;
    this.getProducts();
  }

  nextPage(): void {
    if( this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.getProducts();
  }
}

