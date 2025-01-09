import { response } from 'express';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../service/UserManagement/user-management.service';
import { TokenStoreService } from '../../service/token-store/token-store.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  userInfoForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  fileName: string = 'Tải ảnh lên';
  avatarPreview: string | ArrayBuffer | null = null;
  formSubmitted = false;
  user: any = {};
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,

    private _userManagementService: UserManagementService
  ) {
    this.userInfoForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ỹ0-9\s]*$/),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)], // Kiểm tra số điện thoại 10 chữ số
      ],
      email: [{ value: '', disabled: true }, [Validators.email]],
      profilePicture: [null],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  // Hàm lấy dữ liệu người dùng
  loadUserData(): void {
    this._userManagementService.getProfile().subscribe(
      (response) => {
        if (response && response.status === 'Success' && response.data) {
          const userData = response.data;

          // Kiểm tra dữ liệu trả về có hợp lệ không
          if (userData.fullName && userData.phoneNumber && userData.email) {
            // Điền dữ liệu vào form
            this.userInfoForm.patchValue({
              fullName: userData.fullName,
              phoneNumber: userData.phoneNumber,
              email: userData.email,
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
        //   console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        this.isLoading = false;
      }
    );
  }

  // Xử lý khi người dùng chọn ảnh
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileUrl = URL.createObjectURL(file);
      this.fileName = file.name; // Hiển thị tên file đã chọn
    }
  }

  updateProfile(): void {
    if (this.userInfoForm.valid) {
      const formValues = this.userInfoForm.value;
      const formData: FormData = new FormData();

      formData.append('FullName', formValues.fullName || '');
      formData.append('PhoneNumber', formValues.phoneNumber || '');
      if (this.selectedFile) {
        formData.append(
          'ProfileImage',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      this._userManagementService.updateProfile(formData).subscribe(
        (response) => {
          if (response.status === 'Success') {
            console.log('Profile updated event:', response.data);
            this._userManagementService.profileUpdatedSubject.next(
              response.data
            ); // Phát sự kiện cập nhật
            alert('Cập nhật thành công!');
          }
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Cập nhật thất bại!');
        }
      );
    } else {
      this.userInfoForm.markAllAsTouched(); // Đánh dấu tất cả các trường invalid
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.fileName = file.name; // Update the label with the file name

      // Create a preview for the avatar
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result; // Update the avatar preview
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn một tệp');
    }
  }

  // Kiểm tra xem có lỗi trong form hay không
  get isFullNameInvalid() {
    const control = this.userInfoForm.get('fullName');
    return control?.invalid && (control?.touched || this.formSubmitted);
  }

  get isPhoneNumberInvalid() {
    const control = this.userInfoForm.get('phoneNumber');
    return control?.invalid && (control?.touched || this.formSubmitted);
  }

  // Lấy thông báo lỗi cho từng trường
  get fullNameErrorMessage() {
    const control = this.userInfoForm.get('fullName');
    if (control?.hasError('required')) {
      return 'Họ và tên là bắt buộc.';
    }
    if (control?.hasError('minlength')) {
      return 'Họ và tên phải có ít nhất 4 ký tự.';
    }
    if (control?.hasError('maxlength')) {
      return 'Họ và tên không được vượt quá 50 ký tự.';
    }
    if (control?.hasError('pattern')) {
      return 'Họ và tên không được chứa ký tự đặc biệt.';
    }
    return '';
  }

  get phoneNumberErrorMessage() {
    const control = this.userInfoForm.get('phoneNumber');
    if (control?.hasError('required')) {
      return 'Số điện thoại là bắt buộc.';
    }
    if (control?.hasError('pattern')) {
      return 'Số điện thoại phải gồm 10 chữ số.';
    }
    return '';
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
    this.fileName = 'Tải ảnh lên';
  }
}
