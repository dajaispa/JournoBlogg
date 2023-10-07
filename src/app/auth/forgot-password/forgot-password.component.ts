import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email : string = '';

  constructor(
    private auth : AuthService, 
    private router: Router,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit(): void {
  }

  forgotPassword() {
    let authObs = this.auth.forgotPassword(this.email);
    authObs.subscribe({
    next: res => {
      this.dialogRef.close();
      this.router.navigate(['auth','logIn'])
    },
    error: errorMessage => {
     this.dialogRef.close('Something went wrong');
    }})
    this.email = '';
  }
}
