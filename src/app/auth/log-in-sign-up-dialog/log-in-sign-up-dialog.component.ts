import { Component,                                                                                                                                                    OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { EmailVerificationComponent } from '../email-verification/email-verification.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@Component({
  selector: 'app-log-in-sign-up-dialog',
  templateUrl: './log-in-sign-up-dialog.component.html',
  styleUrls: ['./log-in-sign-up-dialog.component.css']
})
export class LogInSignUpDialogComponent implements OnInit{

  isRegisteredUser: boolean;
  isLoading = false;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]); 

  constructor(
    private authService : AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private alert: AlertService) {}

  ngOnInit(){
    this.isRegisteredUser = this.route.snapshot.params['type'] == 'logIn' ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.isRegisteredUser = params['type'] == 'logIn' ? true : false;
    });
  }

  onSubmit(){
    const email = this.email.value;
    const password = this.password.value;
    let authObs: any;
    this.isLoading = true;
    if(this.email.value && this.password.value && this.email.valid && this.password.valid){
      if (this.isRegisteredUser) {
        authObs = this.authService.login(email,password);
        authObs.subscribe({
          next: res => {
            if(res?.user?.emailVerified == true) {
              this.isLoading = false;
              this.router.navigate(['/home']).then(() => {
                window.location.reload();
                // Refresh the page to update the toolbar
                // this.router.events.pipe(
                //   filter((event) => event instanceof NavigationEnd),
                //   first()
                // ).subscribe(() => {
                //   this.router.navigate([], {
                //     queryParams: { 'refresh': new Date().getTime() },
                //     queryParamsHandling: 'merge'
                //   });
                // });
              });
            } 
            else{
              if(res?.user){
                this.isLoading = false;
                this.dialog.open(EmailVerificationComponent);
              }
              else if(!(res?.user?.emailVerified)){
                this.sendForVerification(res.user);
              }
            }
          },
          error: errorMessage => {
            this.onError(errorMessage);
          }
        });
      } 
      else {
        authObs = this.authService.register(email, password);
        authObs.subscribe({
          next: (user) => {
            this.sendForVerification(user);
          },
          error: (errorMessage) => {
            this.onError(errorMessage);
          }
        });
      }
    }
    else{
      this.isLoading =false;
    }
  }

  sendForVerification(user: any){
    user.sendEmailVerification().then(() => {
      this.isLoading = false;
      this.dialog.open(EmailVerificationComponent);
      this.isRegisteredUser = true;
    }, (err) => {
      this.onError('Something went wrong. Not able to send mail to your email.');
    });
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }

  onForgotPassword(){
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {restoreFocus: false});
    dialogRef.afterClosed().subscribe((errorMessage) => {
      if(errorMessage){
        this.onError(errorMessage);
      }
    });
  }

  onError(errorMessage){
    this.isLoading = false;
    this.alert.openSnackBar(errorMessage, 'error');
  }

  
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage(){
    return this.password.hasError('required') ? 'Password is required' :
       this.password.hasError('minlength') ? 'Password shall have minimum 6 characters' : '';
  }
  

}
