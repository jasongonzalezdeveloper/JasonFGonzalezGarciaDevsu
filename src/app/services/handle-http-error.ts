import { Observable, throwError } from "rxjs";

export function handleHttpError(error: any): Observable<never> {
  const err = error as Error;
    if (err && err.message && err.message !== "") {
      return throwError(() => new Error(err.message));
    }
    return throwError(() => new Error('Unknown error occurred'));
}