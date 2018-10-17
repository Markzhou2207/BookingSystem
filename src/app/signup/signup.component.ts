import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  password1:'';
  password2:'';
  email:'';
  name:'';
  validPassword = true;
  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  //Creates new user account
  signUp(){
    if(this.password1!==this.password2){
      console.log("Incorrect passwords");
    } else if (this.password1.length<6){
      this.validPassword=false;
    
    } else {
      this.authService.emailSignup(this.email,this.name,this.password1);
    }
  }
}
