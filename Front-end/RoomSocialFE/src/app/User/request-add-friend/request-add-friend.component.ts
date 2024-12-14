import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../service/User/user.service';

@Component({
  selector: 'app-request-add-friend',
  templateUrl: './request-add-friend.component.html',
  styleUrl: './request-add-friend.component.css',
})
export class RequestAddFriendComponent implements OnInit {
  searchResults: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Lắng nghe kết quả tìm kiếm
    this.userService.searchResults$.subscribe((results) => {
      this.searchResults = results;
    });
  }

  loadAllUsers(): void {
    this.userService.searchResults$.subscribe((results) => {
      this.searchResults = results.map((user) => ({
        id: user.id,
        name: user.full_name,
        avatar: user.image ? user.image : 'assets/default-avatar.png', // Hình ảnh mặc định nếu null
      }));
    });
  }

  sendFriendRequest(userId: number): void {
    this.userService.addFriendRequest(userId).subscribe(
      (response) => {
        if (response.status === 'Success') {
          alert('Lời mời kết bạn đã được gửi.');
          this.loadAllUsers();
        } else {
          alert('Không thể gửi lời mời kết bạn.');
        }
      },
      (error) => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi gửi lời mời kết bạn.');
      }
    );
  }
}
