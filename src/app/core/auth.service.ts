import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AdalService } from 'adal-angular4';
const config= {                           
  tenant: 'AngularTest.onmicrosoft.com',                      
  clientId: 'e2618299-66f0-4389-af4d-7f08cdfa0d52',    
} 
@Injectable()

export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router,private adal: AdalService) {
  }
  init(){
    this.adal.init(config);
  }
  logIn(){
    this.adal.login();
  }
  logOut(){
    this.adal.logOut();
  }
  handleWindowCallback(){
    this.adal.handleWindowCallback();
  }
  isAuthenticated():boolean{
    return this.adal.userInfo.authenticated;
  }
  public getUsername():string{
    return this.adal.userInfo.userName;
  }
  public getName():string{
    return this.adal.userInfo.profile.name;
  }
}
