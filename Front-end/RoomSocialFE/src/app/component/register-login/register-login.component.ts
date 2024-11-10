import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.css',
})
export class RegisterLoginComponent {
  @Input() isClick: boolean = false;

  constructor() {}

  @ViewChild('fullNameControl') fullNameControl!: NgModel;
  @ViewChild('emailControl') emailControl!: NgModel;
  @ViewChild('numberPhoneControl') numberPhoneControl!: NgModel;
  @ViewChild('passwordControl') passwordControl!: NgModel;
  @ViewChild('passwordAgainControl') passwordAgainControl!: NgModel;
  @ViewChild('passwordLoginControl') passwordLoginControl!: NgModel;
  @ViewChild('emailLoginControl') emailLoginControl!: NgModel;

  isClickNegative = false;
  isLogin = false;
  isRegister = true;

  fullName: string = '';
  email: string = '';
  numberPhone: string = '';
  password: string = '';
  passwordAgain: string = '';
  emailLogin: string = '';
  passwordLogin: string = '';

  user = {
    fullName: '',
    email: '',
    numberPhone: '',
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
    this.numberPhone = '';
    this.password = '';
    this.passwordAgain = '';
    this.emailLogin = '';
    this.passwordLogin = '';

    if (this.fullNameControl) this.fullNameControl.reset();
    if (this.emailControl) this.emailControl.reset();
    if (this.numberPhoneControl) this.numberPhoneControl.reset();
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
      this.user.numberPhone != '' &&
      this.user.password != '' &&
      this.passwordAgain != ''
    ) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.user.email)) {
        alert('Email không đúng định dạng');
      }

      if (this.user.password !== this.passwordAgain) {
        alert('Mật khẩu không khớp.');
      } else {
        alert('Đăng ký thành công');
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin.');
    }
  }

  // Xử lý submit form đăng nhập (chưa thực hiện logic)
  onSubmitLogin() {}
}
