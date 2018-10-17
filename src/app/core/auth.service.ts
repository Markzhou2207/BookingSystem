import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class AuthService {
  authState: any = null;
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.authState = JSON.parse(localStorage.getItem('currentUser'));

  }

  //Checks if the user is logged in
  get isLoggedIn(): boolean {
    return this.authState !== null;
  }

  //Returns the email of the user
  get currentUserEmail(): any{
    return this.authState.user.email;
  }
  //Returns the full name of the user
  get currentUserName():any{
    return this.authState.user.displayName;
  }


  /**
   * Verifies user email/password against firebase's log
   *  Stores the current session in local storage in case of refresh.
   */
  emailLogin(email:string, password: string){
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
        .then(value =>{
          this.authState=value;
          this.router.navigateByUrl('/home');
          localStorage.setItem('currentUser',JSON.stringify(value));
        })
        .catch(err=>{
          console.log('Something went wrong: ',err.message);
        })
    return false;    
  }

  
  // Creates a new account for the email
  emailSignup(email:string,name:string,password:string){
    this.afAuth.auth.createUserWithEmailAndPassword(email,password)
      .then(value=>{
        this.authState=value;
        console.log('Success',value);
        this.router.navigateByUrl('/home');
        //Adds the users name to the account
        return this.afAuth.auth.currentUser.updateProfile({"displayName":name,photoURL:null});
      })
      .catch(error=>{
        console.log('Something went wrong: ',error);
      })
  }

  // Logs the user out and removes the user session from local storage
  logout(){
    this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/']);
      localStorage.clear();
    });
  }

  // Sends out an email to reset the password
  resetPassword(email:string){
    return this.afAuth.auth.sendPasswordResetEmail(email)
        .then(()=>console.log("email sent"))
        .catch((error)=>{
          console.log(error);
        })
  }
  
}
