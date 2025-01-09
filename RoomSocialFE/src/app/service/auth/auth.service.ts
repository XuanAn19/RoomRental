import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { TokenStoreService } from '../token-store/token-store.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { json } from 'stream/consumers';
import internal from 'stream';

export interface Category {
  id: number;
  name: string;
  rooms: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(
    private _api: ApiService,
    private _token: TokenStoreService,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUserDecodeToken());
    this.user = this.userSubject.asObservable();
  }

  Call_API_LoginUser(credential: any): Observable<any> {
    return this._api
      .API_Basic_PostTypeRequest('Authenticate/login', {
        email: credential.email,
        password: credential.password,
      })
      .pipe(
        map((response: any) => {
          console.log('API Response:', response);
          if (response) {
            console.log('Actor1:', response.roles);
            const actor = response.roles;
            this._token.setToken(response.accessToken);
            this._token.setIdUser(response.idUser);
            this._token.setUser(actor);
            this.userSubject.next(actor);
            return actor;
          } else {
            throw new Error('Thông tin đăng nhập không hợp lệ');
          }
        })
      );
  }

  Call_API_RegisterUser(requestBody: any): Observable<any> {
    return this._api.API_Basic_PostTypeRequest(
      'Authenticate/register',
      requestBody
    );
  }

  Call_API_Logout(): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('Authenticate/logout', {});
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

  Call_API_ForgotPassword(email: string): Observable<any> {
    return this._api.API_Basic_PostTypeRequest(
      `Authenticate/forgot_password/${email}`,
      {}
    );
  }

  Call_API_ResetPassword(email: string, password: string): Observable<any> {
    const url = this._api.API_Basic_PostTypeRequest(
      `Authenticate/reset_password/${email}/${password}`,
      {}
    );
    console.log('API: ' + url);
    console.log('Password: ' + password);
    return url;
  }

  Call_API_GetMyInformation(): Observable<any> {
    const url = 'Authenticate/get_my_information';
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_GetCategory(): Observable<any> {
    const url = 'Categories';
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_PostRoom(requestBody: any): Observable<any> {
    return this._api.API_Basic_PostTypeRequest('Rooms/post_room', requestBody);
  }

  Call_API_ListRoomByIdUser(id: String): Observable<any> {
    const url = `Rooms/User/${id}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByID(id: number): Observable<any> {
    const url = `Rooms/${id}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByCategory(id: number): Observable<any> {
    const url = `Rooms/Category/${id}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByKeyName(idUser: String, keyName: String): Observable<any> {
    const url = `Rooms/User/${idUser}/Search/${keyName}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByCategoryWithUser(idUser: String, idCategory: number): Observable<any> {
    const url = `Rooms/User/${idUser}/Category/${idCategory}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByStatusWithUser(idUser: String, status: boolean): Observable<any> {
    const url = `Rooms/User/${idUser}/Status/${status}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByKeyNameWithCategoryWithUser(idUser: String, keyName: String, idCategory: number): Observable<any> {
    const url = `Rooms/User/${idUser}/Search/${keyName}/Category/${idCategory}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByKeyNameWithStatusWithUser(idUser: String, keyName: String, status: boolean): Observable<any> {
    const url = `Rooms/User/${idUser}/Search/${keyName}/Status/${status}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_RoomByKeyNameWithCategoryWithUserWithStatus(idUser: String, keyName: String, idCategory: number, status: boolean): Observable<any> {
    const url = `Rooms/User/${idUser}/Search/${keyName}/Category/${idCategory}/Status/${status}`;
    return this._api.API_Basic_GetTypeRequest(url);
  }

  Call_API_HideRoom(id: internal): Observable<any> {
    const url = `Rooms/switch_status_room/${id}`;

    return this._api.API_Basic_PutTypeRequest(url, {});
  }

  Call_API_UpdateRoom(id: number, data: any): Observable<any> {
    const url = `Rooms/${id}`;
    return this._api.API_Basic_PutTypeRequest(url, data);
  }




}
