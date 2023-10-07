import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
  constructor(public dialogRef: MatDialogRef<EmailVerificationComponent>, private router: Router) { }
  onLogIn(){
    this.dialogRef.close();
    this.router.navigate(['auth','logIn'])
  }
}
