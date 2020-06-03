import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UploadingComponent} from "./dashboard/uploading/uploading.component";
import {PapersComponent} from "./dashboard/papers/papers.component";
import {AccountComponent} from "./dashboard/account/account.component";
import {SignupComponent} from "./signup/signup.component";
import {RouteGuardService} from "./auth/routeguard.service";
import {ResultsComponent} from "./results/results.component";


const routes: Routes = [
  {
    path:"",
    component:HomepageComponent
  },
  {
    path:"dashboard",
    component:DashboardComponent,
    canActivate:[RouteGuardService]
  },
  {
    path:"upload",
    component:UploadingComponent,
    canActivate:[RouteGuardService]
  },
  {
    path:"papers",
    component:PapersComponent,
    canActivate:[RouteGuardService]
  },
  {
    path:"results",
    component:ResultsComponent,
  },
  {
    path:"account",
    component:AccountComponent,
    canActivate:[RouteGuardService]
  },
  {
    path:"signup",
    component:SignupComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
