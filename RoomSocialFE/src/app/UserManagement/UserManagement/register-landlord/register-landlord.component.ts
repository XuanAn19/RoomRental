import { UserManagementService } from './../../service/UserManagement/user-management.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-landlord',
  templateUrl: './register-landlord.component.html',
  styleUrls: ['./register-landlord.component.css'],
})
export class RegisterLandlordComponent implements OnInit {
  registerForm: FormGroup;
  selectedAvatarFile: File | null = null;
  fileNameAvatar: string = 'Tải ảnh lên';
  fileNamesCCCD: string[] = ['Tải ảnh CCCD']; // Chỉ cần một tên nút tải ảnh
  avatarPreview: string | ArrayBuffer | null = null;
  cccdPreviews: (string | null)[] = [null, null];
  selectedCCCDFiles: File[] = [];
  isLoading: boolean = true;
  alreadyRegistered: boolean = false;
  imageSrcs: string[] = []; // Mảng lưu trữ các hình ảnh đã tải lên
  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService
  ) {
    // Khởi tạo form với các trường
    this.registerForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      profilePicture: [null],
      cccdFile: [null],
      agreeTerms: [false, Validators.requiredTrue],
    });
  }
  ngOnInit(): void {
    this.loadUserData();
  }
  // Hàm lấy dữ liệu người dùng
  loadUserData(): void {
    this.userManagementService.getProfile().subscribe(
      (response) => {
        if (response && response.status === 'Success' && response.data) {
          const userData = response.data;

          // Kiểm tra dữ liệu trả về có hợp lệ không
          if (userData.fullName && userData.phoneNumber && userData.email) {
            // Điền dữ liệu vào form
            this.registerForm.patchValue({
              fullName: userData.fullName,
              phoneNumber: userData.phoneNumber,
            });

            // Hiển thị ảnh đại diện nếu có
            if (userData.image) {
              this.avatarPreview = userData.image;
            }
          }
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  registerLandlord() {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('FullName', this.registerForm.get('fullName')?.value || '');
    formData.append(
      'PhoneNumber',
      this.registerForm.get('phoneNumber')?.value || ''
    );

    if (this.selectedAvatarFile) {
      formData.append('ProfileImage', this.selectedAvatarFile);
    }

    if (this.selectedCCCDFiles.length > 1) {
      this.selectedCCCDFiles.forEach((file, index) => {
        formData.append('CccdImages', file);
      });
    } else {
      alert('Vui lòng tải lên 2 ảnh CCCD.');
      return;
    }

    this.isLoading = true;

    this.userManagementService.registerLandlord(formData).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.status === 'Fail') {
          this.handleErrorMessage(response.message);
        } else {
          alert('Đăng ký thành công! Vui lòng chờ xác nhận từ admin.');
        }
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400 && error.error?.errors) {
          // Xử lý lỗi chi tiết trong error.errors
          const validationErrors = error.error.errors;
          const errorMessages = Object.values(validationErrors)
            .flat()
            .join(', ');
          alert(`Đăng ký thất bại! Lỗi: ${errorMessages}`);
        } else if (error.status === 400 || error.status === 401) {
          const errorMessage =
            error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
          this.handleErrorMessage(errorMessage);
        } else {
          console.error('Đăng ký thất bại:', error);
          alert('Đăng ký thất bại! Vui lòng thử lại sau.');
        }
      },
    });
  }

  /**
   * Hàm xử lý các thông báo lỗi từ API
   * @param message Thông báo lỗi từ API
   */
  private handleErrorMessage(message: string) {
    switch (message) {
      case 'User registered verify.':
        alert('Bạn đã được xác minh là chủ trọ.');
        break;
      case 'User already submitted verification request.':
        alert(
          'Bạn đã gửi yêu cầu đăng ký làm chủ trọ. Vui lòng chờ xác nhận từ admin.'
        );
        break;
      default:
        alert(`Đăng ký thất bại! Lỗi: ${message}`);
    }
  }

  onFileSelected(event: Event, fileType: 'avatar' | 'cccd') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'avatar') {
        this.selectedAvatarFile = input.files[0];
        this.fileNameAvatar = this.selectedAvatarFile.name;

        // Xem trước ảnh đại diện
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarPreview = reader.result as string;
        };
        reader.readAsDataURL(this.selectedAvatarFile);
      } else if (fileType === 'cccd') {
        const newFiles = Array.from(input.files).slice(0, 2);
        const remainingSlots = 2 - this.selectedCCCDFiles.length;

        // Chỉ thêm ảnh vào nếu còn chỗ
        if (remainingSlots > 0) {
          const filesToAdd = newFiles.slice(0, remainingSlots);
          this.selectedCCCDFiles.push(...filesToAdd);
          this.fileNamesCCCD.push(...filesToAdd.map((file) => file.name));

          // Xem trước ảnh CCCD
          filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Thêm preview ảnh mới vào mảng cccdPreviews
              this.cccdPreviews[this.selectedCCCDFiles.indexOf(file)] =
                reader.result as string;
            };
            reader.readAsDataURL(file);
          });
        } else {
          alert('Chỉ có thể chọn tối đa 2 tệp!');
        }
      }
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.selectedAvatarFile = null;
    this.fileNameAvatar = 'Tải ảnh lên'; // Reset the button label
  }

  removeCCCD(index: number): void {
    this.cccdPreviews[index] = null;

    this.selectedCCCDFiles[index] = new File([], '');

    this.fileNamesCCCD[index] = 'Tải ảnh CCCD';
  }
}
