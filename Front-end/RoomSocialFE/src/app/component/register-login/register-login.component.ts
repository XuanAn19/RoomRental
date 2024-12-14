import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.css',
})
export class RegisterLoginComponent {
  @Input() isClick: boolean = false;
  @Output() emailRegistered: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _auth: AuthService, private _router: Router) {}

  @ViewChild('fullNameControl') fullNameControl!: NgModel;
  @ViewChild('emailControl') emailControl!: NgModel;
  @ViewChild('phoneNumberControl') phoneNumberControl!: NgModel;
  @ViewChild('passwordControl') passwordControl!: NgModel;
  @ViewChild('passwordAgainControl') passwordAgainControl!: NgModel;
  @ViewChild('passwordLoginControl') passwordLoginControl!: NgModel;
  @ViewChild('emailLoginControl') emailLoginControl!: NgModel;

  isClickNegative = false;
  isLogin = false;
  isRegister = true;

  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  passwordAgain: string = '';
  emailLogin: string = '';
  passwordLogin: string = '';

  user = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: '',
  };

  onLoginClicked() {
    this.isClickNegative = true;
  }

  isNegative() {
    this.isClickNegative = !this.isClickNegative;
    this.isLogin = !this.isLogin;
    this.isRegister = !this.isRegister;

    this.fullName = '';
    this.email = '';
    this.phoneNumber = '';
    this.password = '';
    this.passwordAgain = '';
    this.emailLogin = '';
    this.passwordLogin = '';

    if (this.fullNameControl) this.fullNameControl.reset();
    if (this.emailControl) this.emailControl.reset();
    if (this.phoneNumberControl) this.phoneNumberControl.reset();
    if (this.passwordControl) this.passwordControl.reset();
    if (this.passwordControl) this.passwordControl.reset();
    if (this.passwordAgainControl) this.passwordAgainControl.reset();
    if (this.passwordLoginControl) this.passwordLoginControl.reset();
    if (this.emailLoginControl) this.emailLoginControl.reset();
  }

  // Xử lý submit form đăng ký
  onSubmitRegister() {
    if (
      this.user.fullName != '' &&
      this.user.email != '' &&
      this.user.phoneNumber != '' &&
      this.user.password != '' &&
      this.passwordAgain != ''
    ) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.user.email)) {
        alert('Email không đúng định dạng');
      }
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(this.user.password)) {
        alert('Mật khẩu không hợp lệ!');
      } else {
        if (this.user.password !== this.passwordAgain) {
          alert('Mật khẩu không khớp.');
        } else {
          this._auth.Call_API_RegisterUser(this.user).subscribe(
            (response: any) => {
              alert('Đăng ký thành công');
              this._router.navigate(['verify-account'], {
                queryParams: { email: this.user.email },
              });
              //this.isVerify = true;
              //this._router.navigate(['uiuser/regiter']);
            },
            (error: any) => {
              console.error('Đăng ký lỗi', error);
            }
          );
        }
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin.');
    }
  }

  onSubmitLogin() {
    if (this.emailLogin === '' || this.passwordLogin === '') {
      alert('Vui lòng điền đầy đủ thông tin!');
    } else {
      this._auth
        .Call_API_LoginUser({
          email: this.emailLogin,
          password: this.passwordLogin,
        })
        .subscribe(
          (actor) => {
            alert('Đăng nhập thành công');
            //     this._router.navigate(['post-for-rent']);
            this._router.navigate(['personal-page']);
            console.log('Token negative: ' + this._token.getToken());
            console.log('idUser:', this._token.getIdUser());
          },
          (error) => {
            console.error('Đăng nhập lỗi:', error);
            alert('Đăng nhập lỗi. Vui lòng kiểm tra lại thông tin');
          }
        );
    }
  }
}
