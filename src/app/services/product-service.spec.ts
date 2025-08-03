import { HttpClient } from '@angular/common/http';
import { ProductService } from './product-service';
import { mockProductsList } from '../mocks/productsListMocks';
import { ProductResponse } from '../models/product-response';
import { asyncData } from '../utils/async-data';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const apiUrl = 'http://localhost:3002/bp/products';
  const mockProducts : ProductResponse = {
    data: mockProductsList
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new ProductService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return a list of products',(done: DoneFn) => {
      httpClientSpy.get.and.returnValue(asyncData(mockProducts));
      service.getProducts(false).subscribe({
        next: (products) => {
          expect(products.data.length).toBe(12);
          expect(products.data).toEqual(mockProductsList);
          done();
        },
        error: done.fail
      });
      expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
    });

    it('should return an empty list when no products are available', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(asyncData({ data: [] }));
      service.getProducts(false).subscribe({
        next: (products) => {
          expect(products.data.length).toBe(0);
          expect(products.data).toEqual([]);
          done();
        },
        error: done.fail
      });
      expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
    });
  });

  describe('getProductsByPage', () => {
    it('should return a paginated list of products', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(asyncData(mockProducts));
      service.getProducts(false).subscribe({
        next: (products) => {
          expect(products.data.length).toBe(12);
          expect(products.data).toEqual(mockProductsList);
        },
        error: done.fail
      });
       service.getProductsByPage(1, 10, '', false).subscribe({
        next: (products) => {
          expect(products.data.length).toBe(10);
          expect(products.totalPages).toBe(2);
          expect(products.totalProducts).toBe(12);
          done();
        },
        error: done.fail
      });
      expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(2);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(asyncData(mockProductsList[0]));
      service.getProductById('12').subscribe({
        next: (product) => {
          expect(product.id).toBe('12');
          expect(product.name).toBe('Cuenta Corriente Empresarial');
          expect(product.description).toBe('Solución bancaria para empresas.');
          expect(product.logo).toBe('https://www.visa.com.do/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Find%20a%20Card/Credit%20cards/Classic/visa_classic_card_400x225.jpg');
          expect(product.date_release).toEqual(new Date("2023-12-10"));
          expect(product.date_revision).toEqual(new Date("2024-12-10"));
          done();
        },
        error: done.fail
      });
      expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', (done: DoneFn) => {
      const product = {
        id: '130',
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto.',
        logo: 'https://www.ejemplo.com/logo.jpg',
        date_release: new Date("2023-12-10"),
        date_revision: new Date("2024-12-10"),
      };
      httpClientSpy.post.and.returnValue(asyncData({message: 'Product added successfully', data: product}));
      service.createProduct(product).subscribe({
        next: (product) => {
          expect(product.data.id).toBe('130');
          expect(product.data.name).toBe('Nuevo Producto');
          expect(product.data.description).toBe('Descripción del nuevo producto.');
          expect(product.data.logo).toBe('https://www.ejemplo.com/logo.jpg');
          expect(product.data.date_release).toEqual(new Date("2023-12-10"));
          expect(product.data.date_revision).toEqual(new Date("2024-12-10"));
          done();
        },
        error: done.fail
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product', (done: DoneFn) => {
      const product = {
        id: '130',
        name: 'Este ya no es un nuevo Producto',
        description: 'Descripción del producto existente.',
        logo: 'https://www.ejemplo.com/logo.jpg',
        date_release: new Date("2023-12-10"),
        date_revision: new Date("2024-12-10"),
      };
      httpClientSpy.put.and.returnValue(asyncData({message: 'Product updated successfully', data: product}));
      service.updateProduct(product).subscribe({
        next: (product) => {
        expect(product.data.id).toBe('130');
        expect(product.data.name).toBe('Este ya no es un nuevo Producto');
        expect(product.data.description).toBe('Descripción del producto existente.');
        expect(product.data.logo).toBe('https://www.ejemplo.com/logo.jpg');
        expect(product.data.date_release).toEqual(new Date("2023-12-10"));
        expect(product.data.date_revision).toEqual(new Date("2024-12-10"));
          done();
        },
        error: done.fail
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product',(done: DoneFn) =>{
      httpClientSpy.delete.and.returnValue(asyncData({'message': 'Product removed successfully'}));
      service.deleteProduct('120').subscribe({
        next: (response) => {
          expect(response).toEqual({'message': 'Product removed successfully'});
          done();
        },
        error: done.fail
      });
    });
  });

  describe('isProductValid', () => {
    it('should id product exists', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(asyncData(true));
      service.isProductValid('120').subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          done();
        },
        error: done.fail
      });
    });
  });
});
