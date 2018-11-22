import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore'

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private db;
  constructor(dbTemp: AngularFirestore) { 
      this.db = dbTemp;
  }

  // Gets all bookings made by the given email
  getBookingsByName(email: string): Observable<any[]>{
    console.log(email);
    return  this.db.collection(email,ref=>ref.where('email','==',email)).valueChanges();
  }

  // Gets all booking made for the given environment
  getBookingsByEnviroment(env: string): Observable<any[]>{
    return  this.db.collection('masterList',ref=>ref.where('environment','==',env)).valueChanges();
  }

  // Deletes a booking
  deleteBooking(email:string,env: string, start: Date, end: Date){
    console.log("delete booking -- "+name+env+start.getTime()+start.getTime());
    this.db.collection('masterList').doc(email+env+start.getTime()+start.getTime()).delete();
    this.db.collection(email).doc(email+env+start.getTime()+start.getTime()).delete();
  }

  //Creates a booking
 makeBooking(email :string,name:string, env: string, start: Date, end: Date){
      let now = new Date();
      let temp = new Date(now.getFullYear(),now.getMonth(),now.getDate());
      var data = {
      startDate: start,
      endDate: end,
      email: email,
      environment: env,
      name: name,
      type: "standard",
      dateBooked: temp
    };
    var docName = email+env+start.getTime()+start.getTime();
    var setDoc = this.db.collection('masterList').doc(docName).set(data);

    var setDoc = this.db.collection(email).doc(docName).set(data);
  }

  makePencilBooking(email :string,name:string,
     env: string, start: Date, end: Date, owners: string[]){
      let now = new Date();
      
      let temp = new Date(now.getFullYear(),now.getMonth(),now.getDate());
      var data = {
        startDate: start,
        endDate: end,
        email: email,
        environment: env,
        name: name,
        type: "pencil pending",
        owners:owners,
        dateBooked: temp
      };
      var docName = email+env+start.getTime()+start.getTime();
      var setDoc = this.db.collection('masterList').doc(docName).set(data);
  
      var setDoc = this.db.collection(email).doc(docName).set(data);
  }

}

