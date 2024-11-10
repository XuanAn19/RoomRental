import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './UserManagement/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './UserManagement/change-password/change-password.component';
import { RegisterLandlordComponent } from './UserManagement/register-landlord/register-landlord.component';
import { VerifyAccountComponent } from './component/verify-account/verify-account.component';
const routes: Routes = [
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register-landlord', component: RegisterLandlordComponent },

  { path: '', redirectTo: '/edit-profile', pathMatch: 'full' },

  { path: '**', redirectTo: '/edit-profile' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
