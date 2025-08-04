import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeleteProductModal } from '../delete-product-modal/delete-product-modal';

@Component({
  selector: 'product-list',
  imports: [
    CommonModule,
    FormsModule,
    DeleteProductModal
  ],
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

  selectedProductId: string = '';
  selectedProductName: string = '';
  isDeleteModalOpen: boolean = false;

  dropdownId = '';

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.getProducts(true);
  }

  ngOnDestroy() {
    this.isProductsLoading$.complete();
  }

  getProducts(refresh: boolean) {
    this.isProductsLoading$.next(false);
    this.productService.getProductsByPage(this.currentPage, this.quantityPerPage, this.searchTerm, refresh).pipe(
      map(products => products)
    ).subscribe({
      next: (products) => {
        if (products.data.length > 0) {
          this.isProductsLoading$.next(true);
        }
        this.totalProducts = products.totalProducts;
        this.totalPages = products.totalPages;
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
    this.getProducts(false);
  }

  addProduct(): void {
    this.router.navigate(['/add-product']);
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.getProducts(false);
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.getProducts(false);
  }

  setDeleteModal(productId: string, productName: string): void {
    this.selectedProductId = productId;
    this.selectedProductName = productName;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedProductId = '';
    this.selectedProductName = '';
    this.getProducts(true);
  }

  toggleDropdown(id: string): void {
    if (this.dropdownId === id) {
      this.dropdownId = '';
    } else {
      this.dropdownId = id;
    }
  }

  editProduct(productId: string): void {
    this.dropdownId = '';
    this.router.navigate(['/edit-product', productId]);
  }
}

