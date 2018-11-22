import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import {NgbDateStruct, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../core/auth.service';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit{

  validBooking = true;
  submitted = true; 
  request = {} as any;
  environments=['Dev','Test','SIT','UAT','Prod'];
  today = new Date();
  testBookings = [];
  bookingOwner=[];
  bookingEmails=[];
  bookingStatus=[];
  booked = false;
  selectedStatus:string;
  selectedOwner:null;
  selectedFrom:Date;
  selectedTo:Date;
  pencilledStatus:string;
  pencilledOwner:null;
  pencilledFrom:Date;
  pencilledTo:Date;


  //NgbCalendar
  model: NgbDateStruct;
  date: {year: number, month: number};
  minDate: NgbDateStruct = {year : this.today.getFullYear(), 
    month : this.today.getMonth()+1, day:this.today.getDate()};
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(private bookingService: BookingService,
     private calendar: NgbCalendar,
    private authService:AuthService,
    public snackbar: MatSnackBar ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
    this.request.environment="";
    this.request.email=this.authService.getUsername();
    this.request.name=this.authService.getName();
    console.log(this.request.name);

   }

  /**
   * Checks if booking for an environment is free
   * Creates booking if the slot is free
   */

  makeBooking() {
    if(this.request.environment==""){
      this.submitted = false;
    } else {
      var notBooked = true;
      const tempStart = new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
      const tempEnd = new Date(this.toDate.year,this.toDate.month-1,this.toDate.day);
      var bookingOwner = [];

      for(var i=0;i<this.testBookings.length;i=i+2){
        if(tempStart.getTime()>=this.testBookings[i].getTime()
          && tempStart.getTime()<=this.testBookings[i+1].getTime() 
          || tempEnd.getTime()>=this.testBookings[i].getTime() 
          && tempEnd.getTime()<=this.testBookings[i+1].getTime()
          ||tempStart.getTime()<=this.testBookings[i].getTime()
          && tempEnd.getTime()>=this.testBookings[i+1].getTime()){
            bookingOwner.push(this.bookingEmails[i/2]);
            if(this.bookingStatus[i/2]=='pencil' ||
            this.bookingStatus[i/2]=='pencil pending'){
              notBooked = false;
            }
          }
        }
                               
        if (bookingOwner.length>0 && notBooked){
           this.bookingService.makePencilBooking(this.request.email,this.request.name,
           this.request.environment,tempStart,tempEnd,bookingOwner);
           this.openSnackBar();
        } else if(notBooked){
           this.bookingService.makeBooking(this.request.email,this.request.name,
           this.request.environment,tempStart,tempEnd);
           this.openSnackBar();
        } else {
           this.validBooking=false;
        }
      }


  }
  
 

  ngOnInit() {
  }
  /**
   * Grabs list of bookings for the selected environment for display
   */
  envChanged(){
    this.testBookings=[];
    this.bookingOwner=[];
    this.bookingEmails=[];
    this.bookingStatus=[];
    this.bookingService.getBookingsByEnviroment(this.request.environment).subscribe(b=>{
      for(var i=0;i<b.length;i++){
        console.log("Getting "+b[i].name+" "+b[i].type);
        const start = new Date(b[i].startDate.seconds*1000);
        start.setHours(0);
        const end = new Date(b[i].endDate.seconds*1000);
        end.setHours(0);
        this.testBookings.push(start);
        this.testBookings.push(end);
        this.bookingOwner.push(b[i].name);
        this.bookingEmails.push(b[i].email);
        this.bookingStatus.push(b[i].type);
        }
    });  
  }


  //Ngbcalendar stuff

  /**
   * Updates values when a date is selected in the date picker
   * @param date Selected date
   */
  onDateSelection(date: NgbDate) {
    this.selectedOwner = null;
    this.pencilledOwner=null;
    this.booked=false;
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else if (this.fromDate && !this.toDate && date.equals(this.fromDate)){
      this.toDate = date; 
    } else {
      this.toDate = null;
      this.fromDate = date;  
    }
    this.getBookingOwner(date);
  }

  

  /**
   *  Checks if the mouse is hovering over a date
   */
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  /**
   *  Checks if a date is inside the selected range on the calendar
   */
  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
   * Checks if a date is currently booked
   * @param date 
   */
  isBooked(date: NgbDate){
    var tempDate = new Date(date.year,date.month-1,date.day);
    for(var i=0;i<this.testBookings.length;i=i+2){
        if(tempDate.getTime()>=this.testBookings[i].getTime()
        &&tempDate.getTime()<=this.testBookings[i+1].getTime()
        && this.bookingStatus[i/2]=='standard'){
          return true;
        }
    }
    return false;
  }

  /**
   * Checks if there is a pencilled booking for the date
   */
  isPencilled(date: NgbDate){
    var tempDate = new Date(date.year,date.month-1,date.day);
    for(var i=0;i<this.testBookings.length;i=i+2){
        if(tempDate.getTime()>=this.testBookings[i].getTime()
        &&tempDate.getTime()<=this.testBookings[i+1].getTime()
        &&( this.bookingStatus[i/2]=='pencil'
        ||this.bookingStatus[i/2]=='pencil pending')){
          return true;
        }
    }
    return false;
  }

  /**
   * Checks if there's a pencilled booking as well as a standard booking for the date
   */
  isBookedAndPencilled(date: NgbDate){
    if(this.isBooked(date)&&this.isPencilled(date)){
      return true;
    }
  }  

  /**
   * Returns the owner of the booking if a date is booked
   * @param date 
   */
  getBookingOwner(date: NgbDate){
  var tempDate = new Date(date.year,date.month-1,date.day);

    for(var i=0;i<this.testBookings.length;i=i+2){
        if(tempDate.getTime()>=this.testBookings[i].getTime()
        &&tempDate.getTime()<=this.testBookings[i+1].getTime()){
          if(this.bookingStatus[i/2]=='pencil'||this.bookingStatus[i/2]=='pencil pending'){
            this.pencilledOwner = this.bookingOwner[i/2];          
            this.pencilledFrom =this.testBookings[i];
            this.pencilledTo = this.testBookings[i+1];
            this.pencilledStatus = this.bookingStatus[i/2];
          } else {
            this.selectedOwner = this.bookingOwner[i/2];
            this.selectedFrom =this.testBookings[i];
            this.selectedTo = this.testBookings[i+1];
            this.selectedStatus = this.bookingStatus[i/2];
          }
            this.booked=true;
        }
    }
  }

  /**
   * Opens the snackbar to confirm the booking has been made
   */
  openSnackBar(){
    this.snackbar.openFromComponent(BookingConfirmationComponent,{
      duration:1500,
    })
  }
}



@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent{}