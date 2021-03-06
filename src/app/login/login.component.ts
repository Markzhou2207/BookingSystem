import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:'';
  password:'';
  constructor(private authService:AuthService) { }

  ngOnInit() {
  }
  login(){
    this.authService.emailLogin(this.email,this.password);

  }
}
