import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  constructor(
    private router: Router,
    private _api: ApiService,
    private _auth: AuthService
  ) {}

  email: string = '';
  code: string = '';
  password: string = '';
  passwordAgain: string = '';

  isEmail = true;
  isFormCode = false;
  isFormEmail = false;

  cancelEmail() {
    this.router.navigate(['/']);
  }

  sendEmail() {
    // this.isEmail = false;
    if (!this.email) {
      alert('Vui lòng nhập email!');
      return;
    }

    // Gửi email cho server để xác minh email
    this._auth.Call_API_SendPasswordResetEmail(this.email).subscribe(
      (response: { success: any }) => {
        if (response.success) {
          this.isEmail = false;
          // this.isFormEmail = true;
          this.isFormEmail = !this.isFormEmail;
        } else {
          alert('Email không tồn tại!');
        }
      },
      (error: any) => {
        console.error('Lỗi khi gửi email', error);
        alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    );
  }

  cancelCode() {
    this.isFormEmail = !this.isFormEmail;
    this.isEmail = true;
  }

  verifyCode() {
    if (!this.code) {
      alert('Vui lòng nhập mã xác nhận!');
      return;
    }

    // Xác minh mã gửi qua email
    this._auth.Call_API_VerifyCode(this.email, this.code).subscribe(
      (response: { success: any }) => {
        if (response.success) {
          this.isFormEmail = false;
          this.isFormCode = !this.isFormCode;
          this.isEmail = false;
        } else {
          alert('Mã xác nhận không đúng!');
        }
      },
      (error: any) => {
        console.error('Lỗi khi xác minh mã', error);
        alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    );
  }

  cancelPassword() {
    this.isFormEmail = !this.isFormEmail;
    this.isFormCode = !this.isFormCode;
  }

  resetPassword() {
    if (!this.password || !this.passwordAgain) {
      alert('Vui lòng nhập mật khẩu!');
      return;
    }

    if (this.password !== this.passwordAgain) {
      alert('Mật khẩu không khớp!');
      return;
    }

    // Gửi mật khẩu mới lên server
    this._auth.Call_API_ResetPassword(this.email, this.password).subscribe(
      (response: { success: any }) => {
        if (response.success) {
          alert('Mật khẩu đã được thay đổi thành công!');
          // Reset form hoặc chuyển hướng tới trang đăng nhập
          //this.router.navigate['/register-login'];
        } else {
          alert('Đã xảy ra lỗi khi thay đổi mật khẩu.');
        }
      },
      (error: any) => {
        console.error('Lỗi khi thay đổi mật khẩu', error);
        alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    );
  }
}
