import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/page/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {HomeComponent} from "./components/page/home/home.component";
import {MyDataComponent} from "./components/page/my-data/my-data.component";
import {DataNewComponent} from "./components/page/data-new/data-new.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'my-data', component: MyDataComponent, canActivate: [AuthGuard] },
  { path: 'my-data/new', component: DataNewComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
