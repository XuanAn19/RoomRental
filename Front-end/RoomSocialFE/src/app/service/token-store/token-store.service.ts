import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

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
      const token = sessionStorage.getItem(this.TOKEN_KEY); // Lấy token trước
      console.log('Token from sessionStorage:', token); // In ra console trước khi trả về
      return token; // Trả về token
    }
    return null;
  }

  public setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  public setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
}
