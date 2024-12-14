import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/User/user.service';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.css',
})
export class PersonalPageComponent implements OnInit {
  posts: any[] = [];
  newStatus: string = '';

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadPosts();
  }

  // Hàm để tải danh sách bài đăng
  loadPosts(): void {
    this.userService.getPosts().subscribe((posts) => {
      this.posts = posts; // Lưu danh sách bài đăng vào mảng posts
    });
  }

  // Hàm để đăng trạng thái mới
  postStatus(): void {
    if (this.newStatus.trim() !== '') {
      this.userService.postStatus(this.newStatus).subscribe(() => {
        this.newStatus = ''; // Xóa nội dung sau khi đăng bài
        this.loadPosts(); // Làm mới danh sách bài đăng sau khi đăng thành công
        this.userService.notifyPostCountUpdated(); // Gửi thông báo cập nhật
      });
    }
  }

  // Hàm để xử lý khi nhấn Enter trong textarea
  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Nếu nhấn Enter mà không giữ Shift thì đăng bài
      event.preventDefault(); // Ngăn chặn xuống dòng
      this.postStatus(); // Gọi hàm đăng bài
    }
  }

  // Hàm xử lý xóa trạng thái
  onDeleteStatus(statusId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      this.userService.deleteStatus(statusId).subscribe(
        (response) => {
          if (response.status === 'Success') {
            alert('Xóa bài viết thành công.');
            this.posts = this.posts.filter((post) => post.id !== statusId); // Cập nhật danh sách bài viết
            this.userService.notifyPostCountUpdated();
          } else {
            alert(response.message || 'Xóa bài viết thất bại.');
          }
        },
        (error) => {
          console.error('Lỗi khi xóa bài viết:', error);
          alert('Lỗi xóa bài viết.');
        }
      );
    }
  }
}
