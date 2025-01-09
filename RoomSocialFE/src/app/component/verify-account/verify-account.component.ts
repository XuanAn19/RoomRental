import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css',
})
export class VerifyAccountComponent {
  codeVerify: string = '';
  email: string = '';
  constructor(
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: string }) => {
      this.email = params['email'];
      // alert('email:' + this.email);
    });
  }

  onSubmitVerify() {
    if (this.codeVerify != '') {
      this._auth.Call_API_VerifyCode(this.email, this.codeVerify).subscribe(
        (actor) => {
          alert('Xác thực thành công');
          this._router.navigate(['register-login']);
        },
        (error) => {
          console.error('Lỗi:', error);
          alert('Mã không đúng');
        }
      );
    } else {
      alert('Vui lòng điền vào ô mã code!');
    }
  }
}
