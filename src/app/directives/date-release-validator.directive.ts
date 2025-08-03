import { Directive, forwardRef, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { IdExistsValidator } from '../validators/id-exists-validator';
import { Observable } from 'rxjs';

@Directive({
  selector: '[idExistsValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => DateReleaseValidatorDirective),
      multi: true,
    },
  ],
})
export class DateReleaseValidatorDirective implements AsyncValidator{
  private readonly validator = inject(IdExistsValidator);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}
