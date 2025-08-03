import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Product } from '../../models/product';
import { FormProduct } from '../form-product/form-product';
import { GoBack } from '../../ui/go-back/go-back';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'edit-product',
  imports: [
    CommonModule,
    FormProduct,
    GoBack
  ],
  templateUrl: './edit-product.html',
  styleUrls: [
    '../scss/container.scss',
    './edit-product.scss'
  ]
})
export class EditProduct {
  productId = '';
  product: Product | null = null;

  loadingProduct$ = new BehaviorSubject<boolean>(false);

  private route = inject(ActivatedRoute);


  constructor(private productService: ProductService, private changeDetector: ChangeDetectorRef) {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
  }


  ngOnInit() {
    if (this.productId) {
      this.loadProduct();
    } else {
      alert('Product ID is required to edit a product.');
    }
  }

  ngOnDestroy() {
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.loadingProduct$.next(true);
        this.product = product;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        alert(error.message);
      }
    });
  }
}
