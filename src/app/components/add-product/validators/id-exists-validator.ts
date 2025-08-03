import { inject, Injectable } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IdExistsValidator implements AsyncValidator {
  private readonly productService = inject(ProductService);

  validate(control: AbstractControl): Observable<ValidationErrors|null> {
    const id = control.value;
    return this.productService.isProductValid(id).pipe(
      map(exists => (exists ? null : { idExists: true })),
      catchError(() => of(null))
    );
  }

}
