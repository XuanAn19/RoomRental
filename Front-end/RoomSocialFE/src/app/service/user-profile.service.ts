import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  number_phone: string;
  password: string;
  id_role: number;
  image?: string;
  status?: boolean;
  image_CCCD?: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = '';
  constructor(private http: HttpClient) {}

  //lấy ds  thông tin user
  getUserProfile(): Observable<{ message: string; data: UserProfile[] }> {
    return this.http
      .get<{ message: string; data: UserProfile[] }>(this.apiUrl)
      .pipe(
        catchError(
          this.handleError<{ message: string; data: UserProfile[] }>(
            'getUserProfile',
            { message: '', data: [] }
          )
        )
      );
  }

  //lấy thông tin user theo id
  getUserProfileById(id: number): Observable<UserProfile> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<UserProfile>(url)
      .pipe(catchError(this.handleError<UserProfile>('getUserProfileById')));
  }

  //chỉnh sửa hồ sơ
  updateUserProfile(id: number, user: Partial<UserProfile>): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .put<void>(url, user, this.httpOptions)
      .pipe(catchError(this.handleError<void>('updateUserProfile')));
  }

  // hàm đổi mật khẩu
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${userId}/change-password`;
    const body = { currentPassword, newPassword };

    return this.http
      .post<{ message: string }>(url, body, this.httpOptions)
      .pipe(
        catchError(this.handleError<{ message: string }>('changePassword'))
      );
  }

  //đăng ký làm chủ trọ
  registerLandlord(
    id: number,
    profileData: Partial<UserProfile>, // Dữ liệu người dùng (số điện thoại, email, v.v.)
    cccdFrontFile?: File,
    cccdBackFile?: File
  ): Observable<any> {
    const url = `${this.apiUrl}/${id}/register-landlord`;
    const formData = new FormData();

    // Thêm các trường từ profileData vào FormData
    Object.keys(profileData).forEach((key) => {
      const value = profileData[key as keyof UserProfile];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Thêm các file nếu có
    if (cccdFrontFile) formData.append('cccd_front', cccdFrontFile);
    if (cccdBackFile) formData.append('cccd_back', cccdBackFile);

    return this.http
      .post(url, formData)
      .pipe(catchError(this.handleError<any>('registerLandlord')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
}
