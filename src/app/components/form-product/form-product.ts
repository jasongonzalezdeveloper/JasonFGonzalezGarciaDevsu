import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { dateReleaseValidator } from '../../validators/date-release-validator';
import { Product } from '../../models/product';

@Component({
  selector: 'form-product',
  imports: [  
    ReactiveFormsModule
  ],
  templateUrl: './form-product.html',
  styleUrl: './form-product.scss'
})
export class FormProduct {
  @Input() 
  product: Product | null = null;

  productForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private router: Router) {
    this.productForm = this.formBuilder.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['',[
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: ['', Validators.required],
      date_release: ['', [
        Validators.required,
        dateReleaseValidator
      ]],
      date_revision: [{value: '', disabled: true}, [
        Validators.required
      ]]
    });
  }

  ngOnInit() {
    this.setProductForm();
    this.setValueForDateRevision();
  }

  setValueForDateRevision() {
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
    if (value) {
      this.productForm.get('date_revision')?.setValue(this.setDate(value));
    }
   });
  }

  setDate(date: string) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate.toISOString().split('T')[0];
  }

  setProductForm() {
    if(this.product) {
      this.productForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        logo: this.product.logo,
        date_release: this.setDate(this.product.date_release.toString()),
        date_revision: this.setDate(this.product.date_revision.toString())
      });
      this.productForm.get('id')?.disable();
    }
  }

  ngOnDestroy() {
    this.productForm.reset();
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  resetForm() {
    if(this.product) {
      this.setProductForm();
    } else {
      this.productForm.reset();
    }
  }
  
  onSubmit() {
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();
    if(this.productForm.valid) {
      const formData = this.productForm.getRawValue();
      if(this.product) {
        this.productService.updateProduct(formData).subscribe({
          next: (response: any) => {
            alert(response.message ?? 'Producto actualizado exitosamente');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            alert(error.message);
          }
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: (response: any) => {
            alert(response.message ?? 'Producto agregado exitosamente');
            this.productForm.reset();
          },
          error: (error) => {
            alert(error.message);
          }
        });
      }

      
    }
  }
}
