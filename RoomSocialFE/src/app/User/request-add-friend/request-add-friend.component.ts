import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../service/User/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-add-friend',
  templateUrl: './request-add-friend.component.html',
  styleUrl: './request-add-friend.component.css',
})
export class RequestAddFriendComponent implements OnInit {
  searchResults: any[] = [];

  constructor(private userService: UserService, private _router: Router) {}

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
        avatar: user.image ? user.image : 'blank_avatar.jpg', // Hình ảnh mặc định nếu null
      }));
    });
  }

  sendFriendRequest(userId: number): void {
    this.userService.addFriendRequest(userId).subscribe(
      (response) => {
        if (response.status === 'Success') {
          alert('Lời mời kết bạn đã được gửi.');

          // this.loadAllUsers();
          this._router.navigate(['request-add-friend']);
        } else {
          alert('Lỗi! Bạn đã yêu cầu kết bạn với người này');
        }
      },
      (error) => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi gửi lời mời kết bạn.');
      }
    );
  }
}
