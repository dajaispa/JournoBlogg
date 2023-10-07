import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateNewPostComponent } from './post/create-new-post/create-new-post.component';
import { PostCardComponent } from './post/posts/post-card/post-card.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { HeaderComponent } from './home/header/header.component';
import { RightSectionComponent } from './post/posts/right-section/right-section.component';
import { SideNavComponent } from './home/side-nav/side-nav.component';
import { PostsComponent } from './post/posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortenPipe } from './shared/pipes/shorten.pipe';
import { ProfileComponent } from './profile/profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogInSignUpDialogComponent } from './auth/log-in-sign-up-dialog/log-in-sign-up-dialog.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { ReadingTimePipe } from './shared/pipes/reading-time.pipe';
import { environment } from 'src/enviornments/environment';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ViewPostComponent } from './post/view-post/view-post.component';
import { AppMaterialModule } from './shared/material.module';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertComponent } from './shared/alert/alert.component';
import { ProfileEditDialogComponent } from './profile/profile-edit-dialog/profile-edit-dialog.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { CommentsDialogComponent } from './post/posts/comments-dialog/comments-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateNewPostComponent,
    PostCardComponent,
    HomePageComponent,
    HeaderComponent,
    RightSectionComponent,
    SideNavComponent,
    PostsComponent,
    ShortenPipe,
    ProfileComponent,
    LogInSignUpDialogComponent,
    LoadingSpinnerComponent,
    LandingPageComponent,
    ReadingTimePipe,
    ForgotPasswordComponent,
    EmailVerificationComponent,
    ViewPostComponent,
    AlertComponent,
    ConfirmDialogComponent,
    ProfileEditDialogComponent,
    CommentsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkStepperModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppMaterialModule,
  ],
  entryComponents: [AlertComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
    { provide: MatSnackBarRef, useValue: {}}
    // {
    // provide: HTTP_INTERCEPTORS,
    // useClass: AuthInterceptorService,
    // multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
