import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditProfileComponent } from './UserManagement/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './UserManagement/change-password/change-password.component';
import { RegisterLandlordComponent } from './UserManagement/register-landlord/register-landlord.component';
import { HeaderComponent } from './component/header/header.component';
import { RegisterLoginComponent } from './component/register-login/register-login.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { VerifyAccountComponent } from './component/verify-account/verify-account.component';

@NgModule({
  declarations: [
    AppComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    RegisterLandlordComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    RegisterLoginComponent,
    VerifyAccountComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, RouterModule, FormsModule],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
