import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProduct } from './edit-product';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product-service';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { mockProductsList } from '../../mocks/productsListMocks';
import { asyncData } from '../../utils/async-data';
import { Product } from '../../models/product';

describe('EditProduct', () => {
  let component: EditProduct;
  let fixture: ComponentFixture<EditProduct>;
  let router: Router;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let mockProduct = mockProductsList[0];
  let mockEmpty = {} as Product;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
    productServiceSpy.getProductById.and.returnValue(asyncData(mockProduct));

    await TestBed.configureTestingModule({
      imports: [EditProduct],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '12'
              }
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EditProduct);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product with ID 12', () => {
    expect(productServiceSpy.getProductById).toHaveBeenCalledWith('12');
    expect(component.productId).toEqual('12');
    expect(component.product).toBeDefined();
    expect(component.product?.id).toEqual('12');
  });

  it('should wait to loadingProduct$ to be false after loading product', () => {
    productServiceSpy.getProductById.and.returnValue(of(mockEmpty));
    component.loadProduct();
    component.loadingProduct$.subscribe((loading) => {
      expect(loading).toBeFalse();
    });

  });
});