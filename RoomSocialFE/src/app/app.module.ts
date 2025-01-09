import { MatSliderModule } from '@angular/material/slider';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { VerifyAccountComponent } from './component/verify-account/verify-account.component';
import { PostForRentComponent } from './component/post-for-rent/post-for-rent/post-for-rent.component';
import { ListPostComponent } from './component/list-post/list-post/list-post.component';
import { EditPostComponent } from './component/edit-post/edit-post/edit-post.component';
import { TokenStoreService } from './service/token-store/token-store.service';
import { authInterceptorProviders, MyInterceptorService } from './service/my-interceptor/my-interceptor.service';
import { HomePageComponent } from './component/home-page/home-page.component';
import { FooterComponent } from './component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchRoomrentalRoommateComponent } from './component/search-roomrental-roommate/search-roomrental-roommate.component';
import { BookMarkComponent } from './component/book-mark/book-mark.component';
import { ApprovalListComponent } from './component/approval-list/approval-list.component';
import { SidebarComponent } from './UserManagement/sidebar/sidebar.component';
import { AddFriendComponent } from './User/add-friend/add-friend.component';
import { PersonalPageComponent } from './User/personal-page/personal-page.component';
import { RequestAddFriendComponent } from './User/request-add-friend/request-add-friend.component';
import { UnfriendComponent } from './User/unfriend/unfriend.component';
import { UserProfileComponent } from './User/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    RegisterLandlordComponent,
    ForgotPasswordComponent,
    PostForRentComponent,
    HeaderComponent,
    VerifyAccountComponent,
    ListPostComponent,
    EditPostComponent,
    RegisterLoginComponent,
    HomePageComponent,
    FooterComponent,
    SearchRoomrentalRoommateComponent,
    BookMarkComponent,
    ApprovalListComponent,
    SidebarComponent,
    AddFriendComponent,
    PersonalPageComponent,
    RequestAddFriendComponent,
    UnfriendComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSliderModule,
  ],
  providers: [
    // provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptorService, multi: true },
    TokenStoreService, authInterceptorProviders
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
