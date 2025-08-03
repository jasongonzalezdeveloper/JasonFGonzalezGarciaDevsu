import { Observable, throwError } from "rxjs";

export function handleHttpError(error: any): Observable<never> {
  // if (error.error && error.error.name && error.error.name !== "") {
  //   return throwError(() => new Error(error.error.message));
  // } else if(error.status === 400) { 
  //   return throwError(() => new Error('La solicitud no es válida. Por favor, verifica los datos e intenta nuevamente.'));
  // } 
  return throwError(() => new Error('Error al procesar la solicitud. Intenta nuevamente.'));
}