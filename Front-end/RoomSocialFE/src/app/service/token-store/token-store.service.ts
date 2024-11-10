import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStoreService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';

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
}
