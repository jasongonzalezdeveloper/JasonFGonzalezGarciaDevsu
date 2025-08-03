import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateReleaseValidator: ValidatorFn = (control: AbstractControl): ValidationErrors  | null => {
  if (!control.value) return { required: true };

  const date_release = new Date(control.value + 'T00:00:00'); 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date_release < today) {
    return { dateReleaseInvalid: true };
  }
  return null;
}
