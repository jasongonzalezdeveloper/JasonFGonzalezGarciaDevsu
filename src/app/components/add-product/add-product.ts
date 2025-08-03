import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateReleaseValidator } from '../../validators/date-release-validator';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { FormProduct } from '../form-product/form-product';
import { GoBack } from '../../ui/go-back/go-back';

@Component({
  selector: 'add-product',
  imports: [
    FormProduct,
    GoBack
  ],
  templateUrl: './add-product.html',
  styleUrls: [
    '../scss/container.scss',
    './add-product.scss'
  ]
})
export class AddProduct {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
