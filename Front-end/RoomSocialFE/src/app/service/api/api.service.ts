import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/';

  constructor(private _http: HttpClient) {}

  API_Basic_GetTypeRequest(url: string) {
    return this._http.get(`${this.baseUrl}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
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
}
