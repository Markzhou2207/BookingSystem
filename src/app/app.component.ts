import { Component,OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {AuthService } from './core/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loggedIn =localStorage.getItem('currentUser')
  constructor(private authService:AuthService){
  }
  // Logs the user out of the booking system
  logOut(){
    this.authService.logOut();
  }
  ngOnInit(){
    this.authService.init();
    // Handle callback if this is a redirect from Azure
    this.authService.handleWindowCallback();
    // Check if the user is authenticated. If not, call the login() method

    if (!this.authService.isAuthenticated()) {
      this.authService.logIn();
      
    }
    console.log(this.authService.getUsername());
    console.log(this.authService.getName());
  }
}
