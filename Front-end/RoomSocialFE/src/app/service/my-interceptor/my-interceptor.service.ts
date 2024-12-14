import { Injectable } from '@angular/core';
import { TokenStoreService } from '../token-store/token-store.service';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'x-access-token'; //lấy token xác thực
@Injectable()
export class MyInterceptorService implements HttpInterceptor {
  //Đánh dấu class MyInterceptor là một dịch vụ có thể tiêm
  constructor(private _token: TokenStoreService) {
    console.log('token in Header:' + this._token.getToken());
  } //constructor để tiêm dịch vụ TokenStorageService

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._token.getToken();
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      console.log('Modified Request:', authReq);
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

//xác thực các yêu cầu HTTP một cách tự động
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MyInterceptorService, multi: true },
];
