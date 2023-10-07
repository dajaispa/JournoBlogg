import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LogInSignUpDialogComponent } from './auth/log-in-sign-up-dialog/log-in-sign-up-dialog.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { CreateNewPostComponent } from './post/create-new-post/create-new-post.component';
import { ViewPostComponent } from './post/view-post/view-post.component';
import { ProfileComponent } from './profile/profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full'},
  { path: 'auth/:type', component : LogInSignUpDialogComponent},
  { path: 'viewPost', component: ViewPostComponent},
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'createNew', component: CreateNewPostComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
