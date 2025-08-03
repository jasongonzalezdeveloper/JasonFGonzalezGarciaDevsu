import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateReleaseValidator } from './validators/date-release-validator';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'add-product',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {
  productForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
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
   this.productForm.get('date_release')?.valueChanges.subscribe(value => {
    if (value) {
      const revisionDate = new Date(value);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);
      const formattedDate = revisionDate.toISOString().split('T')[0];
      this.productForm.get('date_revision')?.setValue(formattedDate);
    }
   });
  }

  resetForm() {
    this.productForm.reset();
  }
  
  onSubmit() {
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();
    if(this.productForm.valid) {
      const formData = this.productForm.getRawValue();
      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          alert('Producto agregado exitosamente');
          this.productForm.reset();
        },
        error: (error) => {
          alert(error.message || 'Error al agregar el producto. Por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }
}
