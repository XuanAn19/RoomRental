import { Component, EventEmitter, Output } from '@angular/core';
import { TokenStoreService } from '../../service/token-store/token-store.service';

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

  constructor(private _token: TokenStoreService) {}

  ngOnInit(): void {
    this.token = this._token.getToken();
    this.userInfo = this.getUserInfoFromToken(this.token);
    console.log('Thông tin người dùng:', this.userInfo);
    if (this.token != '') this.isToken = true;
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
}
