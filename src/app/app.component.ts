import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {AuthService } from './core/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn =localStorage.getItem('currentUser')
  constructor(private authService:AuthService){
  }
  // Logs the user out of the booking system
  logOut(){
    this.authService.logout();
  }
}
