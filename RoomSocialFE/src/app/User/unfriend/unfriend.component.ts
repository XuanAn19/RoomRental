import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/User/user.service';

@Component({
  selector: 'app-unfriend',
  templateUrl: './unfriend.component.html',
  styleUrl: './unfriend.component.css',
})
export class UnfriendComponent implements OnInit {
  friendsList: any[] = [];
  errorMessage: string = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadFriends();
    // Lắng nghe sự thay đổi số lượng bạn bè
    this.userService.friendsCountUpdated$.subscribe(() => {
      this.loadFriends(); // Tải lại danh sách bạn bè
    });
  }

  loadFriends(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = sessionStorage.getItem('auth-idUser'); // Lấy userId từ sessionStorage

      if (!userId) {
        this.errorMessage = 'Không tìm thấy thông tin người dùng.';
        return;
      }

      this.userService.getFriendsList(userId).subscribe(
        (data: any[]) => {
          if (data.length === 0) {
            this.errorMessage = 'Bạn không có bạn bè.';
          } else {
            this.friendsList = data; // Dữ liệu đã được map trong service
            this.errorMessage = ''; // Xóa thông báo lỗi nếu có bạn bè
          }
        },
        (error: any) => {
          this.errorMessage = 'Không thể lấy danh sách bạn bè.';
          console.error('Error fetching friend list:', error);
        }
      );
    }
  }

  deleteRequest(id: number): void {
    // console.log('Friend Request ID:', id);
    if (!id) {
      alert('ID không hợp lệ. Không thể hủy kết bạn.');
      return;
    }
    if (confirm('Bạn có chắc muốn hủy kết bạn?')) {
      this.userService.unfriend(id).subscribe(
        (response) => {
          // Cập nhật danh sách bạn bè trực tiếp
          this.friendsList = this.friendsList.filter(
            (friend) => friend.id !== id
          );
          alert('Hủy kết bạn thành công');
        },
        (error) => {
          console.log('Error deleting friend request:', error);
          alert('Không thể hủy kết bạn. Vui lòng thử lại.');
        }
      );
    }
  }
}
