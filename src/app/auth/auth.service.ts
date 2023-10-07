import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { FirebaseError } from '@firebase/util';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Profile } from '../profile/profile.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private fireauth : AngularFireAuth,
    private firestore: AngularFirestore) {
      this.afAuth.authState.subscribe(user => {
        if (!!user && user.emailVerified) {
          this.isAuthenticated$.next(true);
        } else {
          this.isAuthenticated$.next(false);
        }
      });
  }

  getAuthState(): BehaviorSubject<boolean> {
    return this.isAuthenticated$;
  }

  // login method
  login(email : string, password : string) {
    const signInObservable = from(this.fireauth.signInWithEmailAndPassword(email, password));
    return signInObservable.pipe(
      catchError((error) => this.handleError(error)),
      tap(res => {
        localStorage.setItem('token','true');
      }));
  }

  // register method
  // register(email : string, password : string) {
  //   const signUpObservable = from(this.fireauth.createUserWithEmailAndPassword(email, password));
  //   return signUpObservable.pipe(
  //     catchError((error) => this.handleError(error)),
  //     );
  //   // this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
  //   //   alert('Registration Successful');
  //   //   this.sendEmailForVarification(res.user);
  //   // }, err => {
  //   //   alert(err.message);
  //   //   this.router.navigate(['auth','signUp']);
  //   // })
  // }

  
  register(email: string, password: string) {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        let profile = new Profile('','',null,'');
        profile.name = email.split('@')[0];
        profile.email = email;
        profile.profileImg = "assets/img/user.png";
        const userProfile = profile.toJSON();
        return from(this.firestore.collection('profiles').doc(user.uid).set(userProfile)).pipe(
          map(() => user),
          catchError((error) => this.handleError(error))
        );
      }),
      catchError((error) => this.handleError(error))
    );
  }
  
  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate(['auth','logIn']);
    }, err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
    const forgotPasswordObservable = from(this.fireauth.sendPasswordResetEmail(email));
    return forgotPasswordObservable.pipe(
      catchError((error) => this.handleError(error)),
      );
      // this.fireauth.sendPasswordResetEmail(email).then(() => {
      //   this.router.navigate(['auth','logIn']);
      // }, err => {
      //   alert('Something went wrong');
      // })
  }

  // email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      const user = res.user;
      this.router.navigate(['/home']);
      localStorage.setItem('token', JSON.stringify(user.uid));
  
      // Check if user profile already exists
      this.firestore.collection('profiles').doc(user.uid).get().toPromise().then((doc) => {
        if (!doc.exists) {
          // Create new user profile
          let profile = new Profile('', '', null, '');
          profile.name = user.displayName || user.email.split('@')[0];
          profile.email = user.email;
          profile.profileImg = user.photoURL || "assets/img/user.png";
          const userProfile = profile.toJSON();
          this.firestore.collection('profiles').doc(user.uid).set(userProfile);
        }
      });
    }, err => {
      alert(err.message);
    })
  }
  
  private handleError(error: any) {
    let errorMessage: string;
  
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email already exists.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'There is no user record corresponding to this identifier.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'The password is invalid or the user does not have a password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
          break;
        default:
          errorMessage = 'An error occurred while processing your request. Please try again later.';
          break;
      }
    } else {
      errorMessage = 'An unknown error occurred. Please try again later.';
    }
  
    return throwError(() => new Error(errorMessage));
  }

}