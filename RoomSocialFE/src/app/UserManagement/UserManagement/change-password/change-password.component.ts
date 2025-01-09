import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserManagementService } from '../../service/UserManagement/user-management.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  formSubmitted = false;
  avatarPreview: string | ArrayBuffer | null = null;
  fullName: string = '';
  image: string = '';
  isLoading: boolean = true;

  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            this.passwordStrengthValidator(),
          ],
        ],

        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator() }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userManagementService.getProfile().subscribe(
      (response) => {
        if (response && response.status === 'Success' && response.data) {
          const userData = response.data;

          // Lấy dữ liệu họ tên và ảnh đại diện
          this.fullName = userData.fullName || 'User';
          this.avatarPreview = userData.image || 'default-avatar.jpg';

          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        this.isLoading = false;
      }
    );
  }

  // Custom validator để kiểm tra sự khớp của newPassword và confirmPassword
  passwordsMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        formGroup
          .get('confirmPassword')
          ?.setErrors({ passwordsDoNotMatch: true });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
      return null;
    };
  }

  // Validator cho mật khẩu mới với các yêu cầu đặc biệt
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.value;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      if (!password) {
        return null;
      }

      const isValid = passwordRegex.test(password);
      return isValid ? null : { passwordStrength: true };
    };
  }

  // Cập nhật mật khẩu
  updatePassword() {
    this.formSubmitted = true;

    // Kiểm tra nếu form không hợp lệ
    if (this.passwordForm.invalid) {
      this.displayFormErrors();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return;
    }

    // Gọi API để thay đổi mật khẩu
    this.userManagementService
      .changePassword(currentPassword, newPassword)
      .subscribe({
        next: (response) => {
          console.log('Password changed successfully:', response);
          alert('Đổi mật khẩu thành công!');
        },
        error: (err) => {
          console.error('Error changing password:', err);
          if (err.error && err.error.errors) {
            console.log('Validation errors:', err.error.errors);
          }
          alert('Đổi mật khẩu thất bại! Vui lòng kiểm tra lại thông tin.');
        },
      });
  }

  // Hiển thị lỗi từ form
  private displayFormErrors() {
    Object.keys(this.passwordForm.controls).forEach((key) => {
      const control = this.passwordForm.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  // Kiểm tra lỗi của trường currentPassword
  get isCurrentPasswordInvalid() {
    const control = this.passwordForm.get('currentPassword');
    return control?.invalid && (control?.touched || this.formSubmitted);
  }

  // Kiểm tra lỗi của trường newPassword
  get isNewPasswordInvalid() {
    const control = this.passwordForm.get('newPassword');
    return control?.invalid && (control?.touched || this.formSubmitted);
  }

  // Kiểm tra lỗi của trường confirmPassword
  get isConfirmPasswordInvalid() {
    const control = this.passwordForm.get('confirmPassword');
    return control?.invalid && (control?.touched || this.formSubmitted);
  }

  // Thông báo lỗi cho trường currentPassword
  get currentPasswordErrorMessage() {
    const control = this.passwordForm.get('currentPassword');
    if (control?.hasError('required')) {
      return 'Mật khẩu hiện tại là bắt buộc.';
    }
    return '';
  }

  // Thông báo lỗi cho trường newPassword
  get newPasswordErrorMessage() {
    const control = this.passwordForm.get('newPassword');
    if (control?.hasError('required')) {
      return 'Mật khẩu mới là bắt buộc.';
    }
    if (control?.hasError('minlength')) {
      return 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    }
    if (control?.hasError('maxlength')) {
      return 'Mật khẩu mới không được vượt quá 20 ký tự.';
    }
    if (control?.hasError('passwordStrength')) {
      return 'Mật khẩu mới phải chứa ít nhất 1 ký tự viết hoa, 1 ký tự viết thường, 1 ký tự số và 1 ký tự đặc biệt.';
    }
    return '';
  }

  // Thông báo lỗi cho trường confirmPassword
  get confirmPasswordErrorMessage() {
    const control = this.passwordForm.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'Xác nhận mật khẩu là bắt buộc.';
    }
    if (control?.hasError('passwordsDoNotMatch')) {
      return 'Mật khẩu xác nhận không khớp với mật khẩu mới.';
    }
    return '';
  }

  // Hàm để thay đổi kiểu input giữa password và text
  togglePasswordVisibility(field: string): void {
    const input = document.getElementById(
      `${field}-password`
    ) as HTMLInputElement;
    const icon = input.nextElementSibling as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }
}
