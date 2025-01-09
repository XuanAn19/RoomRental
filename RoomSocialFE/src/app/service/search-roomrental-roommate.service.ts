import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api/api.service';
import { SearchDTO } from '../../../Models/search.dto';
import { RoomDTO } from '../../../Models/room.dto';

@Injectable({
  providedIn: 'root',
})
export class SearchRoomrentalRoommateService {
  private baseUrl = 'https://localhost:7170/api';
  constructor(private http: HttpClient, private _api: ApiService) {}

  getRentPosts(): Observable<RoomDTO[]> {
    const url = '/Home/find-retail';
    return this.http.get<RoomDTO[]>(`${this.baseUrl}${url}`);
  }

  getRoommatePosts(): Observable<RoomDTO[]> {
    const url = '/Home/find-roommates';
    return this.http.get<RoomDTO[]>(`${this.baseUrl}${url}`);
  }

  searchRooms(searchCriteria: SearchDTO): Observable<RoomDTO[]> {
    const url = '/Home';
    let params = new HttpParams();

    // Chuyển đổi các tham số tìm kiếm thành HttpParams
    if (searchCriteria.SearchName) {
      params = params.set('SearchName', searchCriteria.SearchName);
    }

    if (searchCriteria.CategoryName) {  // Sửa từ 'SearchName' thành 'CategoryName'
      params = params.set('CategoryName', searchCriteria.CategoryName);
    }

    if (searchCriteria.From) {
      params = params.set('From', searchCriteria.From.toString());
    }

    if (searchCriteria.To) {
      params = params.set('To', searchCriteria.To.toString());
    }

    if (searchCriteria.ArceFrom) {
      params = params.set('ArceFrom', searchCriteria.ArceFrom.toString());
    }

    if (searchCriteria.ArceTo) {
      params = params.set('ArceTo', searchCriteria.ArceTo.toString());
    }

    if (searchCriteria.Province) {
      params = params.set('Province', searchCriteria.Province.trim());
    }
    if (searchCriteria.District) {
      params = params.set('District', searchCriteria.District.trim());
    }
    if (searchCriteria.Ward) {
      params = params.set('Ward', searchCriteria.Ward.trim());
    }

    if (searchCriteria.SortBy) {
      params = params.set('SortBy', searchCriteria.SortBy);
    }

    if (searchCriteria.SortDescending !== undefined) {
      params = params.set('SortDescending', searchCriteria.SortDescending.toString());
    }

    return this.http.get<RoomDTO[]>(`${this.baseUrl}${url}`, { params });
  }
}
