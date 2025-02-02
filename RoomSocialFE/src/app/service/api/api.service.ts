import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:7170/api/';

  constructor(private _http: HttpClient) {}

  API_Basic_GetTypeRequest(url: string) {
    return this._http.get(`${this.baseUrl}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  API_Basic_GetTypeRequest1(url: string): Observable<any[]> {
    return this._http
      .get<any[]>(`${this.baseUrl}${url}`)
      .pipe(map((res) => res));
  }

  API_Basic_GetTypeRequestParams(url: string, payload: any): Observable<any> {
    return this._http
      .get(`${this.baseUrl}${url}/${payload}`)
      .pipe(map((res) => res));
  }

  API_Basic_PostTypeRequest(url: string, payload: any) {
    return this._http.post(`${this.baseUrl}${url}`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }

  API_Basic_PutTypeRequest(url: string, payload: any) {
    return this._http.put(`${this.baseUrl}${url}`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }

  // Hàm xóa
  API_Basic_DeleteTypeRequest(url: string): Observable<any> {
    return this._http.delete(`${this.baseUrl}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  // Phương thức gọi API để bookmark phòng
  API_PostWithHeaders(
    url: string,
    payload: any,
    headers: HttpHeaders
  ): Observable<any> {
    return this._http.post(`${this.baseUrl}${url}`, payload, { headers }).pipe(
      map((res) => res),
      catchError((error) => {
        console.error('Error in POST request with headers:', error);
        return throwError(error);
      })
    );
  }

  API_Basic_GetTypeRequest2(url: string): Observable<any> {
    return this._http.get(`${this.baseUrl}${url}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error in GET request:', error);
        return throwError(() => new Error('Lỗi khi gọi API: ' + error.message));
      })
    );
  }


}
