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
import { HomePageComponent } from './component/home-page/home-page.component';
import { SearchRoomrentalRoommateComponent } from './component/search-roomrental-roommate/search-roomrental-roommate.component';
import { BookMarkComponent } from './component/book-mark/book-mark.component';
import { ApprovalListComponent } from './component/approval-list/approval-list.component';
import { AddFriendComponent } from './User/add-friend/add-friend.component';
import { UnfriendComponent } from './User/unfriend/unfriend.component';
import { PersonalPageComponent } from './User/personal-page/personal-page.component';
import { RequestAddFriendComponent } from './User/request-add-friend/request-add-friend.component';
const routes: Routes = [
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register-landlord', component: RegisterLandlordComponent },
  { path: 'post-for-rent', component: PostForRentComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  { path: 'register-login', component: RegisterLoginComponent },
   { path: '', component: HomePageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'list-post', component: ListPostComponent },
  { path: 'edit-post', component: EditPostComponent },
  {
    path: 'edit-post/:id',
    component: EditPostComponent,
  },
  { path: 'add-friend', component: AddFriendComponent },
  { path: 'unfriend', component: UnfriendComponent },
  { path: 'personal-page', component: PersonalPageComponent },
  { path: 'request-add-friend', component: RequestAddFriendComponent },
  {path: 'home-page', component: HomePageComponent},
  {path: 'search', component: SearchRoomrentalRoommateComponent},
  {path: 'bookmark-list', component: BookMarkComponent},
  {path: 'approval-list', component:ApprovalListComponent},

  // { path: '**', redirectTo: '/approval-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
