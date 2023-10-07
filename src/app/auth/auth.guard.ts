import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from '@firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth: any;
  constructor(private fireauth : AngularFireAuth, private router: Router) {this.auth = getAuth();}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      onAuthStateChanged(this.auth, user => {
        if (user) {
          // User is authenticated, allow access
          subscriber.next(true);
          subscriber.complete();
        } else {
          // User is not authenticated
          this.router.navigate(['']);
          subscriber.next(false);
          subscriber.complete();
        }
      });
    }).pipe(map(isAuthenticated => isAuthenticated));
  }
}
