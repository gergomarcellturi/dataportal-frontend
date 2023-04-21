import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/page/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {HomeComponent} from "./components/page/home/home.component";
import {MyDataComponent} from "./components/page/my-data/my-data.component";
import {DataNewComponent} from "./components/page/data-new/data-new.component";
import {DataEditComponent} from "./components/page/data-edit/data-edit.component";
import {ExploreComponent} from "./components/page/explore/explore.component";
import {DataViewComponent} from "./components/page/data-view/data-view.component";
import {ProfileComponent} from "./components/page/profile/profile.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: ExploreComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'profile/:uid', component: ProfileComponent},
  { path: 'view', redirectTo: 'explore'},
  { path: 'view/:uid', component: DataViewComponent},
  { path: 'my-data', component: MyDataComponent, canActivate: [AuthGuard] },
  { path: 'my-data/new', component: DataNewComponent, canActivate: [AuthGuard]},
  { path: 'my-data/edit/:uid', component: DataEditComponent, canActivate: [AuthGuard]},
  { path: 'my-data/edit', redirectTo: 'my-data/new'},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
