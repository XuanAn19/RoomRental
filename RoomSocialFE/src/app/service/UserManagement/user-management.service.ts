import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStoreService } from '../token-store/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  // Subject để phát sự kiện cập nhật profile
  public profileUpdatedSubject = new BehaviorSubject<any>(null);
  public profileUpdated$ = this.profileUpdatedSubject.asObservable();

  constructor(
    private _api: ApiService,
    private _tokenStore: TokenStoreService,
    private http: HttpClient
  ) {}

  // Hàm để lấy thông tin người dùng
  getProfile(): Observable<any> {
    const url = 'Authenticate/get_my_information';
    return this._api.API_Basic_GetTypeRequest(url);
  }

  updateProfile(formData: FormData): Observable<any> {
    const url = 'Authenticate/update_profile'; // URL của API backend
    console.log('Sending FormData:', formData); // Log để kiểm tra form data

    return this._api.API_Basic_PostTypeRequest(url, formData).pipe(
      tap((response: any) => {
        if (response.status === 'Success') {
          // Cập nhật dữ liệu profile khi có thay đổi
          this.profileUpdatedSubject.next(response.data);
        }
      })
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const url = 'Authenticate/change_password';
    const body = {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    };

    // Gửi POST request đến API
    return this._api.API_Basic_PostTypeRequest(url, body);
  }

  registerLandlord(formData: FormData): Observable<any> {
    const url = 'Authenticate/register_verify'; // URL của API backend
    return this._api.API_Basic_PostTypeRequest(url, formData).pipe(
      tap((response: any) => {
        if (response.status === 'Success') {
          // Cập nhật dữ liệu profile khi có thay đổi
          this.profileUpdatedSubject.next(response.data);
        }
      })
    );
  }
}
