import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api/api.service';
import { TokenStoreService } from './token-store/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private baseUrl = 'https://localhost:7170/api/';
  private bookmarkedRooms: Set<number> = new Set(); //Danh sách phòng đã bookmark
  // EventEmitter để thông báo cập nhật số lượng bookmark
  bookmarkCountChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _api: ApiService,
    private _token: TokenStoreService
  ) {}

  // Gọi API để thêm hoặc xóa bookmark
  Call_API_BookMarkRoom(roomId: number): Observable<any> {
    const token = this._token.getToken();
    if (token) {
      const user = this._token.getUserDecodeToken();
      if (user && user.id) {
        const userId = user.id;
        const requestBody = { id_Room: roomId, id_User: userId };
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );

        return this._api
          .API_PostWithHeaders('BookMark', requestBody, headers)
          .pipe(
            catchError((err) => {
              console.error('API error:', err);
              return throwError(() => new Error('API error'));
            })
          );
      } else {
        console.error('User data is missing or userId is undefined');
        return throwError(
          () => new Error('User data is missing or userId is undefined')
        );
      }
    } else {
      console.error('Token is null or undefined');
      this._router.navigate(['/register-login']);
      return throwError(() => new Error('Token is null or undefined'));
    }
  }

  loadBookmarkedRooms(): void {
    const bookmarkedRooms = sessionStorage.getItem('bookmarkedRooms');
    if (bookmarkedRooms) {
      this.bookmarkedRooms = new Set(JSON.parse(bookmarkedRooms));
    }
    this.emitBookmarkCount();
  }

  saveBookmarkedRooms(): void {
    const bookmarkedRoomsArray = Array.from(this.bookmarkedRooms);
    sessionStorage.setItem(
      'bookmarkedRooms',
      JSON.stringify(bookmarkedRoomsArray)
    );
  }

  updateBookmarkStatus(roomId: number): void {
    if (this.bookmarkedRooms.has(roomId)) {
      this.bookmarkedRooms.delete(roomId);
    } else {
      this.bookmarkedRooms.add(roomId);
    }
    this.saveBookmarkedRooms();
    this.emitBookmarkCount();
  }

  // New
  getBookMarkByUserId(): Observable<any[]> {
    const token = this._token.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this._http.get<any[]>(`${this.baseUrl}BookMark`, { headers }).pipe(
        catchError((err) => {
          console.error('API error:', err);
          return throwError(() => new Error('Failed to fetch bookmarks'));
        })
      );
    } else {
      console.error('User not logged in');
      return throwError(() => new Error('User not logged in'));
    }
  }

  // Kiểm tra trạng thái bookmark
  isBookmarked(roomId: number): boolean {
    return this.bookmarkedRooms.has(roomId);
  }

  // Toggle trạng thái bookmark
  toggleBookmark(roomId: number): void {
    const token = this._token.getToken();
    if (token) {
      this.Call_API_BookMarkRoom(roomId).subscribe({
        next: (res) => {
          if (res.status === 'ok') {
            if (this.bookmarkedRooms.has(roomId)) {
              this.bookmarkedRooms.delete(roomId);
            } else {
              this.bookmarkedRooms.add(roomId);
            }
            this.saveBookmarkedRooms(); // Cập nhật cục bộ
            this.emitBookmarkCount();
          } else {
            console.error('API response error:', res.message);
          }
        },
        error: (err) => console.error('API error:', err),
      });
    } else {
      this._router.navigate(['/register-login']);
    }
  }

   // Phát sự kiện cập nhật số lượng bookmark
   private emitBookmarkCount(): void {
    this.bookmarkCountChanged.emit(this.bookmarkedRooms.size);
  }

   // Nạp danh sách bookmark từ server
   loadBookmarksFromServer(): void {
    this.getBookMarkByUserId().subscribe({
        next: (bookmarks) => {
            this.bookmarkedRooms = new Set(bookmarks.map((b) => b.id_room));
            this.saveBookmarkedRooms();
        },
        error: (err) => console.error('Failed to fetch bookmarks:', err),
    });
}
}
