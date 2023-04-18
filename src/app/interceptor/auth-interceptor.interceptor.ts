import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private afAuth: AngularFireAuth) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return user.getIdToken().then(token => {
            const headers = request.headers
              .set('Authorization', `Bearer ${token}`)
              // .append('Content-Type', 'application/json');
            const authReq = request.clone({ headers });
            return next.handle(authReq).toPromise();
          });
        } else {
          return next.handle(request).toPromise();
        }
      })
    ) as Observable<HttpEvent<any>>;
  }
}
