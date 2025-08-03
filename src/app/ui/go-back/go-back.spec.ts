import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { GoBack } from './go-back';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';

describe('GoBack', () => {
  let component: GoBack;
  let fixture: ComponentFixture<GoBack>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoBack],
      providers: [
        provideRouter(routes)
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
    await router.navigate(['/add-product']);

    fixture = TestBed.createComponent(GoBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at add-product route', () => {
    expect(router.url).toEqual('/add-product');
  });

  it('should click go back button and navigate to previous page', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    fixture.detectChanges();
    expect(router.url).toBe('/products');
  });
});
