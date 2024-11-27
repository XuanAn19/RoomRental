import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  constructor(
    private _router: Router,
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
    this._router.navigate(['/']);
  }

  sendEmail() {
    if (!this.email) {
      alert('Vui lòng nhập email!');
      return;
    } else {
      this._auth.Call_API_ForgotPassword(this.email).subscribe(
        (response) => {
          this.isEmail = false;
          this.isFormEmail = !this.isFormEmail;
        },
        (error: any) => {
          console.error('Lỗi khi gửi email', error);
          alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
      );
    }
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
      (actor) => {
        this.isFormEmail = false;
        this.isFormCode = !this.isFormCode;
        this.isEmail = false;
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
    } else {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(this.password)) {
        alert('Mật khẩu không hợp lệ!');
      } else if (this.password !== this.passwordAgain) {
        alert('Mật khẩu không khớp!');
        return;
      } else {
        // Gửi mật khẩu mới lên server
        this._auth.Call_API_ResetPassword(this.email, this.password).subscribe(
          (response) => {
            alert('Mật khẩu đã được thay đổi thành công!');
            this._router.navigate(['/register-login']);
          },
          (error: any) => {
            console.error('Lỗi khi thay đổi mật khẩu', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
          }
        );
      }
    }
  }
}
