import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductModal } from './delete-product-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product-service';
import { mockProductsList } from '../../mocks/productsListMocks';
import { asyncData } from '../../utils/async-data';
import { throwError } from 'rxjs';

describe('DeleteProductModal', () => {
  let component: DeleteProductModal;
  let fixture: ComponentFixture<DeleteProductModal>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let mockDeleteProduct = {
    message: 'Product removed successfully'
  };

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['deleteProduct']);
    productServiceSpy.deleteProduct.and.returnValue(asyncData(mockDeleteProduct));

    await TestBed.configureTestingModule({
      imports: [DeleteProductModal],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProductModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open delete modal', () => {
    component.openModal = true;
    fixture.detectChanges();
    expect(component.openModal).toBeTrue();
  });

  it('should delete product', (done: DoneFn) => {
    component.productId = mockProductsList[0].id;
    component.productName = mockProductsList[0].name;
    component.openModal = true;
    expect(component.openModal).toBeTruthy();
    component.confirmDelete();
    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(mockProductsList[0].id);
    component.openModal = false;
    component.closeModal();
    expect(component.openModal).toBeFalsy();
    done();
  });

  it('should handle delete product error 404', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    const errorResponse = { status: 404, message: 'Product not found' };

    productServiceSpy.deleteProduct.and.returnValue(throwError(() => errorResponse));

    component.productId = '000';
    component.productName = 'Producto no existente';
    component.openModal = true;

    component.confirmDelete();

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('000');

    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(`Producto ${component.productName} no encontrado.`);
      done();
    }, 100);
  });

  it('should handle delete product error 500', (done: DoneFn) => {
    const alertSpy = spyOn(window, 'alert');
    const errorResponse = { status: 500, message: 'Internal server error' };

    productServiceSpy.deleteProduct.and.returnValue(throwError(() => errorResponse));

    component.productId = '000';
    component.productName = 'Producto no existente';
    component.openModal = true;

    component.confirmDelete();

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('000');
    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith(`Error al eliminar el producto ${component.productName}.`);
      done();
    }, 100);
  });

});
