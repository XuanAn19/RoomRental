import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './UserManagement/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './UserManagement/change-password/change-password.component';
import { RegisterLandlordComponent } from './UserManagement/register-landlord/register-landlord.component';
import { VerifyAccountComponent } from './component/verify-account/verify-account.component';
import { PostForRentComponent } from './component/post-for-rent/post-for-rent/post-for-rent.component';
import { RegisterLoginComponent } from './component/register-login/register-login.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ListPostComponent } from './component/list-post/list-post/list-post.component';
import { EditPostComponent } from './component/edit-post/edit-post/edit-post.component';
const routes: Routes = [
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register-landlord', component: RegisterLandlordComponent },
  { path: 'post-for-rent', component: PostForRentComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  { path: 'register-login', component: RegisterLoginComponent },
  { path: '', component: RegisterLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'list-post', component: ListPostComponent },
  { path: 'edit-post', component: EditPostComponent },
  {
    path: 'edit-post/:id',
    component: EditPostComponent,
  },

  // { path: '**', redirectTo: '/post-for-rent' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
