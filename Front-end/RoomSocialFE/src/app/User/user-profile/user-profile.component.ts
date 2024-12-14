import { UserService } from './../../service/User/user.service';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../service/UserManagement/user-management.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  // Thông tin người dùng
  userProfile: any = {
    phone: '',
    email: '',
    posts: 0,
    friends: 0,
    name: '',
    post: '',
  };
  searchKey: string = '';

  constructor(
    private userManagementService: UserManagementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    // Lắng nghe khi có thông báo cập nhật số lượng bài viết
    this.userService.postCountUpdated$.subscribe(() => {
      this.updatePostCount(); // Cập nhật số lượng bài viết
    });

    // Lắng nghe khi có thông báo cập nhật số lượng bạn bè
    this.userService.friendsCountUpdated$.subscribe(() => {
      this.updateFriendsCount(); // Cập nhật số lượng bạn bè
    });
  }
  loadUserProfile() {
    this.userManagementService.getProfile().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.userProfile = {
            phone: response.data.phoneNumber || 'Không có số điện thoại',
            email: response.data.email || 'Không có email',
            name: response.data.fullName || 'Người dùng',
            post: response.data.image,
            posts: this.userProfile.posts,

            friends: this.userProfile.friends,
          };
        }
      },
    });

    // Lấy số lượng bài viết từ backend
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = sessionStorage.getItem('auth-idUser');
      if (userId) {
        this.userService.getPostsCount(userId).subscribe({
          next: (count) => {
            this.userProfile.posts = count; // Cập nhật số lượng bài viết
          },
        });
      }
    }

    // Lấy số lượng bạn bè từ backend
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = sessionStorage.getItem('auth-idUser');
      if (userId) {
        this.userService.getFriendsCount(userId).subscribe({
          next: (count) => {
            this.userProfile.friends = count;
          },
        });
      }
    }
  }

  onSearch(): void {
    if (this.searchKey.trim() !== '') {
      this.userService.updateSearchResults(this.searchKey);
    }
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150'; // Ảnh mặc định
  }

  updatePostCount(): void {
    const userId = sessionStorage.getItem('auth-idUser');
    if (userId) {
      this.userService.getPostsCount(userId).subscribe({
        next: (count) => {
          this.userProfile.posts = count; // Cập nhật số lượng bài viết
        },
      });
    }
  }

  updateFriendsCount(): void {
    const userId = sessionStorage.getItem('auth-idUser');
    if (userId) {
      this.userService.getFriendsCount(userId).subscribe({
        next: (count) => {
          this.userProfile.friends = count; // Cập nhật số lượng bạn bè
        },
      });
    }
  }
}
