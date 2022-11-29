import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    constructor(private aS:AuthService, private router:Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const TOKEN = this.aS.getToken();
        if (TOKEN != null){
            authReq = authReq.clone({
                setHeaders : {Authorization: "Bearer " + TOKEN}
            });
        }
        return next.handle(authReq).pipe(
            catchError( (err: HttpErrorResponse) => {
                if(err.status == 401){
                    Swal.fire("Tu sesión expiró", "Vuelve a iniciar sesión","info");
                    this.aS.logout();
                }
                if(err.status == 0 ){
                    this.router.navigate(["error"])
                }
                return throwError(err)

            })
        );
    }
}

export const authInterceptorProviders = [{
    provide : HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}]