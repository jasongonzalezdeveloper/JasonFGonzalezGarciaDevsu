import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductList } from './product-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product-service';
import { mockProductsList } from '../../mocks/productsListMocks';
import { asyncData } from '../../utils/async-data';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';


describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let router: Router;

  let mockProductsListPaginated = {
    data: mockProductsList.slice(0, 5),
    totalPages: 2,
    totalProducts: mockProductsList.length
  }

  let mockProductsListPaginatedSearchTerm = {
    data: [mockProductsList[0]],
    totalPages: 1,
    totalProducts: 1
  }

  let mockProductsListWithNoResults = {
    data: [],
    totalPages: 0,
    totalProducts: 0
  }

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductsByPage']);
    productServiceSpy.getProductsByPage.and.returnValue(of(mockProductsListPaginated));

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to add product page', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.addProduct();
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(routerSpy).toHaveBeenCalledWith(['/add-product']);
  });

  it('should isProductsLoading$ false', () => {
    productServiceSpy.getProductsByPage.and.returnValue(of(mockProductsListWithNoResults));
    component.getProducts(true);
    component.isProductsLoading$.subscribe(isLoading => {
      expect(isLoading).toBe(false);
    });
  });

  it('should get products list paginated', (done: DoneFn) => {
    expect(component.totalPages).toBe(2);
    expect(component.totalProducts).toBe(mockProductsList.length);
    component.products$.subscribe(products => {
      expect(products).toEqual(mockProductsListPaginated.data);
      done();
    });
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.previousPage();
    expect(component.currentPage).toBe(1);
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should set products with search term', (done: DoneFn) => {
    productServiceSpy.getProductsByPage.and.returnValue(of(mockProductsListPaginatedSearchTerm));
    let searchTerm = 'Cuenta Corriente Empresarial';
    component.searchProducts(searchTerm);
    expect(component.searchTerm).toBe(searchTerm);

    component.products$.subscribe(products => {
      expect(products).toEqual(mockProductsListPaginatedSearchTerm.data);
      expect(products.length).toBe(1);
      expect(products[0]).toEqual(mockProductsList[0]);
      done();
    });
  });

  it('should set products with search term empty', (done: DoneFn) => {
    productServiceSpy.getProductsByPage.and.returnValue(of(mockProductsListWithNoResults));
    let searchTerm = '';
    component.searchProducts(searchTerm);
    expect(component.searchTerm).toBe(searchTerm);

    component.products$.subscribe(products => {
      expect(products).toEqual(mockProductsListWithNoResults.data);
      expect(products.length).toBe(0);
      done();
    });
  });

  it('should redirect to edit product page', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    productServiceSpy.getProductsByPage.and.returnValue(of(mockProductsListPaginated));
    component.toggleDropdown('12');
    expect(component.dropdownId).toBe('12');
    component.editProduct('12');
    expect(component.dropdownId).toBe('');
    expect(routerSpy).toHaveBeenCalledWith(['/edit-product', '12']);
  });

  it('should show delete modal product close modal', () => {
    component.setDeleteModal('12', 'Cuenta Corriente Empresarial');
    expect(component.isDeleteModalOpen).toBeTrue();
    expect(component.selectedProductId).toBe('12');
    component.closeDeleteModal();
    expect(component.isDeleteModalOpen).toBeFalse();
    expect(component.selectedProductId).toBe('');
  });
});
