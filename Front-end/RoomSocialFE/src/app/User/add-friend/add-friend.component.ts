import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/User/user.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css',
})
export class AddFriendComponent implements OnInit {
  friendRequests: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = sessionStorage.getItem('auth-idUser');
      if (!userId) {
        console.log(
          'auth-idUser is missing in localStorage. Please set it before calling the service.'
        );
        return;
      }
      this.loadFriendRequests();
    }
  }

  loadFriendRequests(): void {
    console.log('Calling getFriendRequests from loadFriendRequests');
    this.userService.getFriendRequests(); // Gọi service để tải danh sách yêu cầu kết bạn
    this.userService.friendRequests$.subscribe((data) => {
      console.log('Raw API data:', data);
      console.log('Friend requests received:', data);
      this.friendRequests = data;
    });
  }

  acceptRequest(requestId: number): void {
    this.userService.acceptFriendRequest(requestId).subscribe(
      (response) => {
        alert('Lời mời kết bạn đã được chấp nhận!');
        this.loadFriendRequests();
      },
      (error) => {
        console.error('Error accepting friend request:', error);
        alert('Không thể chấp nhận lời mời kết bạn.');
      }
    );
  }
  deleteRequest(id: number): void {
    if (confirm('Bạn có chắc muốn xóa lời mời kết bạn này?')) {
      this.userService.deleteFriendRequest(id).subscribe(
        (response) => {
          alert(response.message);
        },
        (error) => {
          console.error('Error deleting friend request:', error);
          alert('Không thể xóa lời mời kết bạn. Vui lòng thử lại.');
        }
      );
    }
  }

  formatDate(date: string): string {
    const diff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    if (diff < 60) return `${diff} s`;
    if (diff < 3600) return `${Math.floor(diff / 60)} m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} d`;
  }
}
