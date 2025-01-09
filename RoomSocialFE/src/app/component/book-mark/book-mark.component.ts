import { AuthService } from './../../service/auth/auth.service';
import { Component } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { Router } from '@angular/router';
import { TokenStoreService } from '../../service/token-store/token-store.service';
import { BookmarkService } from '../../service/bookmark.service';

@Component({
  selector: 'app-book-mark',
  templateUrl: './book-mark.component.html',
  styleUrl: './book-mark.component.css',
})
export class BookMarkComponent {
  savedItems: any[] = []; // Mảng chứa các phòng đã bookmark

  constructor(
    private bookMarkService: BookmarkService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedItems();
  }

  loadSavedItems(): void {
    this.bookMarkService.getBookMarkByUserId().subscribe(
      (response: any[]) => {
        if (response && response.length > 0) {
          this.savedItems = response;
          this.savedItems.forEach((item) => (item.isFavorite = true)); // Đánh dấu đã bookmark
          console.log('Danh sách phòng đã bookmark:', this.savedItems);
        } else {
          this.savedItems = [];
          console.log('Danh sách phòng đã bookmark trống hoặc null');
        }
      },
      (error) => {
        // Kiểm tra lỗi trả về từ API
        if (error.status === 401 || error.status === 403) {
          // Nếu lỗi xác thực hoặc không có quyền, điều hướng đến login
          console.error(
            'Người dùng chưa đăng nhập hoặc không có quyền truy cập',
            error
          );
          this._router.navigate(['/register-login']);
        } else {
          // Nếu lỗi khác (ví dụ: lỗi mạng, server), chỉ log ra và không điều hướng
          console.error('Lỗi khi tải danh sách phòng đã bookmark', error);
        }
      }
    );
  }

  toggleBookMark(item: any): void {
    const roomId = item.rooms.id;
    this.bookMarkService.Call_API_BookMarkRoom(roomId).subscribe(
      (response) => {
        if (response.status === 'ok') {
          item.isFavorite = !item.isFavorite;

          // Cập nhật danh sách hiển thị trong component
          if (item.isFavorite) {
            this.savedItems.push(item);
          } else {
            this.savedItems = this.savedItems.filter(
              (savedItem) => savedItem.rooms.id !== roomId
            );
          }

          // Đồng bộ trạng thái với sessionStorage
          this.bookMarkService.updateBookmarkStatus(roomId);

          console.log('Danh sách phòng sau khi toggle:', this.savedItems);
          console.log('SessionStorage sau khi cập nhật:', sessionStorage.getItem('bookmarkedRooms'));
        } else {
          console.error('API trả về lỗi:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API bookmark:', error);
      }
    );
  }
}
