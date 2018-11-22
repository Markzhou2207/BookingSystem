import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { AdalGuard } from 'adal-angular4';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:[AdalGuard]},
  { path: 'booking', component: BookingPageComponent,canActivate:[AdalGuard]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}