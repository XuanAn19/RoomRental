import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class TokenStoreService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';
  private readonly IDUSER_KEY = 'auth-idUser';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  public setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem(this.USER_KEY);
      if (user) {
        try {
          return JSON.parse(user); // Thử parse nếu có giá trị
        } catch (error) {
          console.error('Error parsing user from sessionStorage:', error);
          return null; // Nếu có lỗi khi parse, trả về null
        }
      }
      return null; // Nếu không có giá trị, trả về null
    }
    return null;
  }

  public setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (user) {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        console.warn('Attempted to store undefined or null user data');
      }
    }
  }

  public clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
    }
  }

  public getIdUser(): string | null {
    return isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem(this.IDUSER_KEY)
      : null;
  }

  public setIdUser(idUser: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.IDUSER_KEY, idUser);
    }
  }

  getUserDecodeToken(): any {
    const token = sessionStorage.getItem('auth-token'); // Lấy token từ sessionStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Giải mã token để lấy thông tin người dùng
        console.log('Decoded token:', decodedToken); // Kiểm tra token đã giải mã
        return decodedToken; // Trả về toàn bộ thông tin giải mã từ token
      } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Nếu có lỗi khi giải mã, trả về null
      }
    }
    return null;
  }
}
