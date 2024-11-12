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
    return this._api.API_Basic_PostTypeRequest('Authenticate/login', {
      email: credential.email,
      password: credential.password,
    });
  }

  Call_API_RegisterUser(requestBody: any): Observable<any> {
    return this._api.API_Basic_PostTypeRequest(
      'Authenticate/register',
      requestBody
    );
  }

  Call_API_Logout() {
    this._token.clearStorage();
    this.userSubject.next(null);
  }

  Call_API_SendPasswordResetEmail(email: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('sendPasswordResetEmail', email);
  }

  Call_API_VerifyCode(email: string, code: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest(
      `Authenticate/verify_code/${email}/${code}`,
      {}
    );
  }

  Call_API_ResetPassword(email: string, newPassword: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('reset-password', {
      email,
      newPassword,
    });
  }
}