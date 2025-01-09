import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenStoreService } from './token-store/token-store.service';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  constructor(
    private tokenStore: TokenStoreService,
    private apiService: ApiService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStore.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getNonLandlordUsers(): Observable<any> {
    return this.apiService.API_Basic_GetTypeRequest(`admin/non-landlord-users`);
  }

  confirmLandlord(userId: string): Observable<any> {
    return this.apiService.API_Basic_PutTypeRequest(`admin/management-verify/confirm/${userId}`, {})
      .pipe(
        catchError(err => {
          console.error('Error:', err);
          return throwError(err); // Hoặc xử lý lỗi tùy ý
        })
      );
  }

  // Phương thức gửi yêu cầu từ chối người dùng
  rejectLandlord(userId: string, reason: string): Observable<any> {
    const payload = { Why: reason }; // Lý do từ chối
    return this.apiService.API_Basic_PutTypeRequest(`admin/management-verify/cancel/${userId}`, payload);
  }

}
