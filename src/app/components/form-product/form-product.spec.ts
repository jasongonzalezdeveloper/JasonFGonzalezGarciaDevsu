import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProduct } from './form-product';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product-service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FormProduct', () => {
  let component: FormProduct;
  let fixture: ComponentFixture<FormProduct>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProduct],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new ProductService(httpClientSpy);
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

    expect(actualRevisionYear).toBe(expectedRevisionYear);
    expect(component.productForm.controls['date_revision'].invalid).toBeTruthy();
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
});
