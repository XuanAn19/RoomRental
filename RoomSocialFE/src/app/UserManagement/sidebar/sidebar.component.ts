import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../service/UserManagement/user-management.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Sửa lại từ 'styleUrl' thành 'styleUrls'
})
export class SidebarComponent implements OnInit {
  avatarPreview: string | ArrayBuffer | null = null;
  fullName: string = '';
  image: string = '';
  isLoading: boolean = true;
  currentRoute: string = '';

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    this.loadUserData();
    // Lắng nghe sự thay đổi từ profileUpdated$
    this.userManagementService.profileUpdated$.subscribe((updatedData) => {
      //   console.log('Received profile update:', updatedData);
      if (updatedData) {
        this.updateSidebar(updatedData);
      } else {
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    this.userManagementService.getProfile().subscribe(
      (response) => {
        if (response && response.status === 'Success' && response.data) {
          const userData = response.data;

          this.fullName = userData.fullName || 'User';
          this.avatarPreview = userData.image || 'blank_avatar.jpg';

          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  updateSidebar(userData: any): void {
    if (!userData) {
      console.warn('No user data provided for sidebar update.');
      return;
    }
    console.log('Updating sidebar with:', userData);
    this.fullName = userData.fullName || 'User';
    this.avatarPreview = userData.image || 'blank_avatar.jpg';
  }
}
