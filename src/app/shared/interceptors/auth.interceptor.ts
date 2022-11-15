import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    constructor(private aS:AuthService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const TOKEN = this.aS.getToken();
        if (TOKEN != null){
            authReq = authReq.clone({
                setHeaders : {Authorization: "Bearer " + TOKEN}
            });
        }
        return next.handle(authReq);
    }
}

export const authInterceptorProviders = [{
    provide : HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}]