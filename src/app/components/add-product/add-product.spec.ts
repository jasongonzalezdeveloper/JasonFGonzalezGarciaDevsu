import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProduct } from './add-product';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AddProduct', () => {
  let component: AddProduct;
  let fixture: ComponentFixture<AddProduct>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProduct],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to products list', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.goBack();
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(routerSpy).toHaveBeenCalledWith(['/products']);
  });
});
