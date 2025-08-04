import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProduct } from './form-product';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product-service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { asyncData } from '../../utils/async-data';
import { throwError } from 'rxjs';

describe('FormProduct', () => {
  let component: FormProduct;
  let fixture: ComponentFixture<FormProduct>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let service: ProductService;
  let router: Router;

  const errorResponse = { status: 500, message: 'Internal server error' };

  let mockProduct = {
    id: '123',
    name: 'Test Product',
    description: 'This is a test product.',
    logo: 'https://example.com/logo.png',
    date_release: new Date('2026-01-01'),
    date_revision: new Date('2027-01-01')
  };

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['updateProduct', 'createProduct']);
    productServiceSpy.updateProduct.and.returnValue(throwError(() => errorResponse));
    productServiceSpy.createProduct.and.returnValue(throwError(() => errorResponse));

    await TestBed.configureTestingModule({
      imports: [FormProduct],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should valid required fields', () => {
    component.productForm.updateValueAndValidity();
    component.productForm.markAllAsTouched();
    expect(component.productForm.controls['id'].hasError('required')).toBeTruthy();
    expect(component.productForm.controls['name'].hasError('required')).toBeTruthy();
    expect(component.productForm.controls['description'].hasError('required')).toBeTruthy();
    expect(component.productForm.controls['logo'].hasError('required')).toBeTruthy();
    expect(component.productForm.controls['date_release'].hasError('required')).toBeTruthy();
  });

  it('should valid min and max length for id', () => {
    component.productForm.updateValueAndValidity();
    component.productForm.controls['id'].markAsTouched();

    component.productForm.controls['id'].setValue('1');
    expect(component.productForm.controls['id'].hasError('minlength')).toBeTruthy();

    component.productForm.controls['id'].setValue('123456789012');
    expect(component.productForm.controls['id'].hasError('maxlength')).toBeTruthy();
    expect(component.productForm.controls['id'].invalid).toBeTruthy();
  });

  it('should valid min and max length for name', () => {
    component.productForm.controls['name'].setValue('NA');
    component.productForm.updateValueAndValidity();
    expect(component.productForm.controls['name'].hasError('minlength')).toBeTruthy();

    let longName = 'A'.repeat(101);
    component.productForm.controls['name'].setValue(longName);
    component.productForm.updateValueAndValidity();
    expect(component.productForm.controls['name'].hasError('maxlength')).toBeTruthy();
    expect(component.productForm.controls['name'].invalid).toBeTruthy();
  });

  it('should valid min and max length for description', () => {
    component.productForm.controls['description'].setValue('NA');
    component.productForm.updateValueAndValidity();
    expect(component.productForm.controls['description'].hasError('minlength')).toBeTruthy();

    let longDescription = 'A'.repeat(201);
    component.productForm.controls['description'].setValue(longDescription);
    component.productForm.updateValueAndValidity();
    expect(component.productForm.controls['description'].hasError('maxlength')).toBeTruthy();
    expect(component.productForm.controls['description'].invalid).toBeTruthy();
  });

  it('should form a valid date_revision', () => {
    const date = new Date();
    const releaseDate = date.toISOString().split('T')[0];
    component.productForm.controls['date_release'].setValue(releaseDate);

    component.productForm.updateValueAndValidity();

    const actualRevisionDate = new Date(component.productForm.controls['date_revision'].value);
    date.setFullYear(date.getFullYear() + 1);
    const expectedRevisionYear = date.getFullYear();
    const actualRevisionYear = new Date(actualRevisionDate.toISOString().split('T')[0]).getFullYear();

    expect(actualRevisionYear).toEqual(expectedRevisionYear);
  });

  it('should valid date date_release', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    const releaseDate = date.toISOString().split('T')[0];
    component.productForm.controls['date_release'].setValue(releaseDate);
    component.productForm.updateValueAndValidity();
    component.productForm.controls['date_release'].markAllAsTouched();
    expect(component.productForm.controls['date_release'].hasError('dateReleaseInvalid')).toBeTruthy();
    expect(component.productForm.controls['date_release'].invalid).toBeTruthy();
  });

  it('should submit form with valid data create product', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    let createResponse = {
      data: mockProduct,
      message: 'Product added successfully'
    }
    productServiceSpy.createProduct.and.returnValue(asyncData(createResponse));

    component.setProductForm();
    component.setValueForDateRevision();

    component.productForm.controls['id'].setValue(mockProduct.id);
    component.productForm.controls['name'].setValue(mockProduct.name);
    component.productForm.controls['description'].setValue(mockProduct.description);
    component.productForm.controls['logo'].setValue(mockProduct.logo);
    component.productForm.controls['date_release'].setValue(mockProduct.date_release);
    component.productForm.controls['date_revision'].setValue(mockProduct.date_revision);

    component.productForm.updateValueAndValidity();
    expect(component.productForm.valid).toBeTruthy();
    component.onSubmit();
    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(createResponse.message || 'Producto agregado exitosamente');
      done();
    }, 100);
    component.resetForm();
    expect(component.productForm.untouched).toBeTruthy();
  });

  it('should submit form with valid data update product', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    let createResponse = {
      data: mockProduct,
      message: 'Product updated successfully'
    }
    productServiceSpy.updateProduct.and.returnValue(asyncData(createResponse));
    component.product = mockProduct;
    component.setProductForm();
    component.setValueForDateRevision();

    component.productForm.updateValueAndValidity();
    component.onSubmit();
    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(createResponse.message || 'Producto actualizado exitosamente');
      done();
    }, 100);
    expect(component.productForm.valid).toBeTruthy();
    expect(component.product).toBeDefined();
  });

  it('should submit form create product with error ', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    component.setProductForm();
    component.setValueForDateRevision();

    component.productForm.controls['id'].setValue(mockProduct.id);
    component.productForm.controls['name'].setValue(mockProduct.name);
    component.productForm.controls['description'].setValue(mockProduct.description);
    component.productForm.controls['logo'].setValue(mockProduct.logo);
    component.productForm.controls['date_release'].setValue(mockProduct.date_release);
    component.productForm.controls['date_revision'].setValue(mockProduct.date_revision);

    component.productForm.updateValueAndValidity();
    expect(component.productForm.valid).toBeTruthy();
    component.onSubmit();
    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(errorResponse.message);
      done();
    }, 100);
    component.resetForm();
    expect(component.productForm.untouched).toBeTruthy();
  });

  it('should submit form update product with error ', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    component.product = mockProduct;
    component.setProductForm();
    component.setValueForDateRevision();

    component.productForm.updateValueAndValidity();
    component.onSubmit();
    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(errorResponse.message);
      done();
    }, 100);
  });
});
