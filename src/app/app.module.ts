import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeComponent, DeleteConfirmation } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { BookingPageComponent, BookingConfirmationComponent } from './booking-page/booking-page.component';
import { FormsModule, 
         ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule,
         MatNativeDateModule,
         MatSnackBar,
         MatInputModule,
         MatSnackBarModule} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import { AuthService } from './core/auth.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookingPageComponent,
    DeleteConfirmation,
    LoginComponent,
    SignupComponent,
    ResetpasswordComponent,
    BookingConfirmationComponent
      ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatBottomSheetModule,
    MatListModule,
    AngularFireAuthModule,
    MatSnackBarModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgbModule.forRoot()
],
  providers: [MatNativeDateModule,AuthService],
  bootstrap: [AppComponent],
  entryComponents: [HomeComponent,DeleteConfirmation,BookingPageComponent,BookingConfirmationComponent]
})
export class AppModule { }
