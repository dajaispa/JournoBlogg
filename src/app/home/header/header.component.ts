import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LogInSignUpDialogComponent } from '../../auth/log-in-sign-up-dialog/log-in-sign-up-dialog.component';
import { delay, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { onAuthStateChanged } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  searchValue: any;
  // private userSub: Subscription;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.authService.getAuthState().pipe(delay(1000)).subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  ngOnInit() {
    this.authService.getAuthState().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  onCreateNewPost(){
    this.router.navigate(['createNew']);
  }

  onViewProfile(){
    this.router.navigate(['profile']);
  }

  onSearch(searchInput: string){
     console.log(searchInput);
  }

  onHome(){
    this.isAuthenticated ? this.router.navigate(['home']) : this.router.navigate(['']);
  }

  onLogInSignUp(type: string){
    this.router.navigate(['auth',type]);
  }

  // openLogInSignUpDialog(selection: string): void {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.closeOnNavigation = false;
  //   dialogConfig.hasBackdrop = true;
  //   dialogConfig.autoFocus = false;
  //   dialogConfig.disableClose = true;
  //   dialogConfig.width = '50vw';
  //   dialogConfig.height = '90vh';
  //   dialogConfig.maxWidth = '100vw';
  //   dialogConfig.maxHeight = '100vh';
  //   dialogConfig.data = selection;
  //   const dialogRef = this.dialog.open(LogInSignUpDialogComponent, dialogConfig);
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  logOut(){
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.userSub.unsubscribe();
  // }

}
