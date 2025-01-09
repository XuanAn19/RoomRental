import { Component, EventEmitter, Output } from '@angular/core';
import { TokenStoreService } from '../../service/token-store/token-store.service';
import { AuthService } from '../../service/auth/auth.service';
import { Route, Router } from '@angular/router';
import { BookmarkService } from '../../service/bookmark.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() loginClicked = new EventEmitter<boolean>();
  isButtonActive = false;
  token: string | null = null;
  userInfo: string = '';
  isToken = false;
  fullName: string = '';
  img_avt: string = '';
  isClickAccount = false;
  actor: string = '';
  bookmarkCount: number = 0;

  constructor(
    private _token: TokenStoreService,
    private _auth: AuthService,
    private _router: Router,
    private bookMarkSerive: BookmarkService
  ) {}

  ngOnInit(): void {
    this.token = this._token.getToken();
    this.userInfo = this.getUserInfoFromToken(this.token);
    this.getInfo();
    this.updateBookmarkCount();
  }

  onLoginClick() {
    this.loginClicked.emit(true);
    this.isButtonActive = true;
  }

  getUserInfoFromToken(token: string | null): any {
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const payloadObject = JSON.parse(decodedPayload);

      const email =
        payloadObject[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ];
      const userName =
        payloadObject[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ];

      return { email, userName };
    }
    return null;
  }

  getInfo() {
    console.log('Token Post For Rent: ', this._token.getToken());
    this._auth
      .Call_API_GetMyInformation()
      .subscribe(
        (response: {
          status: string;
          data: { fullName: any; phoneNumber: any; id: any; image: any };
        }) => {
          if (response.status === 'Success') {
            if (response.data && response.data.fullName) {
              this.fullName = response.data.fullName;
              this.img_avt = response.data.image;
              this.actor = this._token.getUser()[0];
              console.log('Actor: ', this.actor);
              console.log('Data: ', response.data);
              // console.log('Họ và tên:', this.fullName);
            } else {
              console.error('Dữ liệu không đầy đủ:', response.data);
            }
          } else {
            console.error('API trả về lỗi:', response);
          }
        }
      );
  }

  click_account() {
    this.isClickAccount = !this.isClickAccount;
  }

  logout() {
    this._auth.Call_API_Logout().subscribe({
      next: (response) => {
        console.log('Đăng xuất thành công', response);
        this._token.clearStorage();
        this._router.navigate(['register-login']);
        console.log('Token Logout: ', this._token.getToken());
      },
      error: (err) => {
        console.error('Lỗi khi đăng xuất', err);
      },
    });
  }

  // Hàm cập nhật số lượng bookmark
  updateBookmarkCount(): void {
    this.bookMarkSerive.bookmarkCountChanged.subscribe((count: number) => {
      this.bookmarkCount = count;
    });
    this.bookMarkSerive.loadBookmarkedRooms();
  }

  click_DangKyChuTro() {
    this._router.navigate(['register-landlord']);
  }

  click_QuanLyTinDang() {
    this._router.navigate(['list-post']);
  }

  click_DangTin() {
    this._router.navigate(['post-for-rent']);
  }

  click_QuanLyTaiKhoan() {
    this._router.navigate(['edit-profile']);
  }

  click_TimKiemBanBe() {
    this._router.navigate(['personal-page']);
  }

  click_DuyetChuTro() {
    this._router.navigate(['approval-list']);
  }
}
