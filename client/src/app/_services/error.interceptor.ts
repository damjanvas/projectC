import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(
                err => {
                    if (err instanceof HttpErrorResponse) {

                        if (err.status === 400) {
                            return throwError(err.error);
                        }

                        if (err.status === 401) {
                            return throwError(err.statusText);
                        }

                        const appError = err.headers.get('Application-Error');
                        if(appError) {
                            // console.log(appError);
                            return throwError(appError);
                        }

                        let serverError = err.error.errors;
                        let modelStateErrors = '';

                        if(serverError && typeof serverError === 'object') {
                            for(const key in serverError) {
                                if(serverError[key]) {
                                    modelStateErrors += serverError[key] + '\n';
                                }
                            }
                        }

                        return throwError(modelStateErrors || serverError || 'Server Error');
                    }
                })
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};