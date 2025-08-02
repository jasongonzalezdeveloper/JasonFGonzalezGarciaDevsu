import { Component } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-list',
  imports: [
    CommonModule
  ],
  providers: [ProductService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {

  products$: Observable<Product[]> = of([]);
  isProductsLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products$ = this.getProducts();
  }

  getProducts() {
    this.isProductsLoading$.next(true);
    return this.productService.getProducts().pipe(
      map(products => products.data)
    );
  }

  searchProducts(term: string): void {
    if (this.products$ && term) {
      console.log("Searching for:", term);
      this.products$ = this.getProducts().pipe(
        map(products =>
          products.filter(product =>
            product.name.toLowerCase().includes(term.toLowerCase()) ||
            product.description.toLowerCase().includes(term.toLowerCase())
          )
        )
      );
    } else {
      this.products$ = this.getProducts();
    }
  }
}
