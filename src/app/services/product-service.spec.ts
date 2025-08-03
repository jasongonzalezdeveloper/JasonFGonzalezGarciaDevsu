import { TestBed } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product-service';
import { mockProductsList } from '../mocks/productsListMocks';
import { ProductResponse } from '../models/product-response';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3002/bp/products';
  const mockProducts : ProductResponse = {
    data: mockProductsList
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

  });
  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return a list of products',() => {
      service.getProducts(false).subscribe(products => {
        expect(products.data.length).toBe(12);
        expect(products.data).toEqual(mockProductsList);
      });
      const request = httpMock.expectOne(apiUrl);
      expect(request.request.method).toBe('GET');
      request.flush(mockProducts);
    });

    it('should return an empty list when no products are available', () => {
      service.getProducts(false).subscribe(products => {
        expect(products.data.length).toBe(0);
      });
      const request = httpMock.expectOne(apiUrl);
      expect(request.request.method).toBe('GET');
      request.flush({ data: [] });
    });
  });

  describe('getProductsByPage', () => {
    it('should return a paginated list of products', () => {
      service.getProducts(false).subscribe(products => {
        expect(products.data.length).toBe(12);
        expect(products.data).toEqual(mockProductsList);
      });
      service.getProductsByPage(1, 10, '', false).subscribe(products => {
        expect(products.data.length).toBe(10);
        expect(products.totalPages).toBe(2);
        expect(products.totalProducts).toBe(12);
      });
      const requests = httpMock.match(apiUrl);
      expect(requests.length).toBe(2);
      requests.forEach(req => req.flush(mockProducts));
    });
  });

  describe('getProductById', () => {
    it('should return product by id', () => {
      service.getProductById('12').subscribe(product => {
        expect(product.id).toBe('12');
        expect(product.name).toBe('Cuenta Corriente Empresarial');
        expect(product.description).toBe('Solución bancaria para empresas.');
        expect(product.logo).toBe('https://www.visa.com.do/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Find%20a%20Card/Credit%20cards/Classic/visa_classic_card_400x225.jpg');
        expect(product.date_release).toEqual(new Date("2023-12-10"));
        expect(product.date_revision).toEqual(new Date("2024-12-10"));
      });
      const request = httpMock.expectOne(`${apiUrl}/12`);
      expect(request.request.method).toBe('GET');
      request.flush(mockProductsList[0]);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const product = {
        id: '130',
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto.',
        logo: 'https://www.ejemplo.com/logo.jpg',
        date_release: new Date("2023-12-10"),
        date_revision: new Date("2024-12-10"),
      };
      service.createProduct(product).subscribe(product => {
        expect(product.id).toBe('130');
        expect(product.name).toBe('Nuevo Producto');
        expect(product.description).toBe('Descripción del nuevo producto.');
        expect(product.logo).toBe('https://www.ejemplo.com/logo.jpg');
        expect(product.date_release).toEqual(new Date("2023-12-10"));
        expect(product.date_revision).toEqual(new Date("2024-12-10"));
      });
      const request = httpMock.expectOne(apiUrl);
      expect(request.request.method).toBe('POST');
      request.flush(product);
    });
  });

  describe('updateProduct', () => {
    it('should update product', () => {
      const product = {
        id: '130',
        name: 'Este ya no es un nuevo Producto',
        description: 'Descripción del producto existente.',
        logo: 'https://www.ejemplo.com/logo.jpg',
        date_release: new Date("2023-12-10"),
        date_revision: new Date("2024-12-10"),
      };
      service.updateProduct(product).subscribe(product => {
        expect(product.id).toBe('130');
        expect(product.name).toBe('Este ya no es un nuevo Producto');
        expect(product.description).toBe('Descripción del producto existente.');
        expect(product.logo).toBe('https://www.ejemplo.com/logo.jpg');
        expect(product.date_release).toEqual(new Date("2023-12-10"));
        expect(product.date_revision).toEqual(new Date("2024-12-10"));
      });
      const request = httpMock.expectOne(`${apiUrl}/130`);
      expect(request.request.method).toBe('PUT');
      request.flush(product);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product',() =>{
      service.deleteProduct('120').subscribe(response => {
        expect(response).toEqual({'message': 'Product removed successfully'});
      });
      const request = httpMock.expectOne(`${apiUrl}/120`);
      expect(request.request.method).toBe('DELETE');
      request.flush({'message': 'Product removed successfully'});
    });
  });

  describe('isProductValid', () => {
    it('should id product exists', () => {
      service.getProductById('12').subscribe(response => {
        expect(response).toBeTruthy();
      });
      const request = httpMock.expectOne(`${apiUrl}/12`);
      expect(request.request.method).toBe('GET');
      request.flush(mockProductsList[0]);
    });
  });
});
