import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyAccountComponent } from './component/verify-account/verify-account.component';

const routes: Routes = [
  { path: 'verify-account', component: VerifyAccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
