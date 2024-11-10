import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { TokenStoreService } from '../token-store/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private _api: ApiService, private _token: TokenStoreService) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUser());
    this.user = this.userSubject.asObservable();
  }

  Call_API_LoginUser(credential: any): Observable<any> {
    return this._api
      .API_Basic_PostTypeRequest('login', {
        email: credential.email,
        password: credential.password,
      })
      .pipe(
        map((response: any) => {
          if (response && response.token && response.user) {
            console.log('Token:', response.token);
            const actor = response.user;
            if (actor.roles === 'user' || actor.roles === 'admin') {
              this._token.setToken(response.token);
              console.log('Token stored:', this._token.getToken());
              this._token.setUser(actor);
              this.userSubject.next(actor);
              return actor;
            } else {
              throw new Error('Vai trò người dùng không hợp lệ');
            }
          } else {
            throw new Error('Thông tin đăng nhập không hợp lệ');
          }
        })
      );
  }

  Call_API_RegisterUser(requestBody: any): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('register', requestBody);
  }

  Call_API_Logout() {
    this._token.clearStorage();
    this.userSubject.next(null);
  }

  Call_API_SendPasswordResetEmail(email: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('sendPasswordResetEmail', email);
  }

  Call_API_VerifyCode(email: string, code: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('verify-code', { email, code });
  }

  Call_API_ResetPassword(email: string, newPassword: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('reset-password', {
      email,
      newPassword,
    });
  }
}
