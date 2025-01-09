import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../service/approval.service';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css'],
})
export class ApprovalListComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  showDropdown: boolean = false;
  selectedReason: string = ''; // Lý do từ chối

  constructor(private approvalService: ApprovalService) {}

  ngOnInit(): void {
    this.loadNonLandlordUsers();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closePopup() {
    this.selectedUser = null;
    this.showDropdown = false;
  }

  loadNonLandlordUsers() {
    this.approvalService.getNonLandlordUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.users = data;
          console.log('Danh sách người dùng:', data);
        } else {
          console.warn('Danh sách người dùng trống.');
          alert('Hiện tại không có người dùng nào để hiển thị.');
        }
      },
      (error: any) => {
        console.error('Lỗi khi tải danh sách người dùng:', error);
        alert('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      }
    );
  }

  viewUserDetail(userId: string) {
    this.selectedUser = this.users.find((user) => user.id === userId);
    if (
      this.selectedUser &&
      typeof this.selectedUser.images_CCCD === 'string'
    ) {
      this.selectedUser.images_CCCD = this.selectedUser.images_CCCD.split(',');
      console.log('HKSKKS:', this.selectedUser.images_CCCD);
    }
  }

  confirm() {
    if (this.selectedUser) {
      this.approvalService.confirmLandlord(this.selectedUser.id).subscribe({
        next: (response) => {
          alert('Duyệt làm chủ trọ thành công.');
          this.selectedUser.is_true = true; // Cập nhật trạng thái
          window.location.reload();
          this.closePopup();
        },
        error: (error) => {
          console.error(error);
          alert('Lỗi khi duyệt người dùng.');
        },
      });
    }
  }

  // Chức năng từ chối người dùng
  cancel() {
    this.showDropdown = false;
    if (this.selectedUser && this.selectedReason) {
      this.approvalService
        .rejectLandlord(this.selectedUser.id, this.selectedReason)
        .subscribe({
          next: (response) => {
            alert('Từ chối người dùng thành công.');
            this.selectedUser = null;
            window.location.reload();
            this.closePopup();
          },
          error: (error) => {
            console.error(error);
            alert('Lỗi khi từ chối người dùng.');
          },
        });
    } else {
      alert('Vui lòng chọn lý do từ chối.');
    }
  }

  // Khi người dùng chọn lý do từ dropdown
  selectReason(reason: string) {
    this.selectedReason = reason;
    this.cancel();
  }
}
