import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import {NgbDateStruct, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../core/auth.service';
import {MatSnackBar} from '@angular/material';
import { Booking } from '../booking';
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
  booked = false;
  selectedStatus:string;
  selectedFrom:Date;
  selectedTo:Date;
  envBookings = [];
  pencilledBookings = [];
  selectedBooking:Booking;

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

  makeBooking() {
    if(this.request.environment==""){
      this.submitted = false;
    } else {
      var notBooked = true;
      const tempStart = new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
      const tempEnd = new Date(this.toDate.year,this.toDate.month-1,this.toDate.day);
      var bookingOwner = [];

      for(var i=0;i<this.envBookings.length;i++){
        if(tempStart.getTime()>=this.envBookings[i].startDate.getTime()
          && tempStart.getTime()<=this.envBookings[i].endDate.getTime() 
          || tempEnd.getTime()>=this.envBookings[i].startDate.getTime() 
          && tempEnd.getTime()<=this.envBookings[i].endDate.getTime()
          ||tempStart.getTime()<=this.envBookings[i].startDate.getTime()
          && tempEnd.getTime()>=this.envBookings[i].endDate.getTime()){
            if(this.envBookings[i].type=='standard'){
              notBooked = false;
            }
          }
        }
                               
        if (!notBooked){
           this.bookingService.makePencilBooking(this.request.email,this.request.name,
           this.request.environment,tempStart,tempEnd,bookingOwner);
           this.openSnackBar();
           console.log("Making Pencil Booking");
        } else if(notBooked){
           this.bookingService.makeBooking(this.request.email,this.request.name,
           this.request.environment,tempStart,tempEnd);
           this.openSnackBar();
           console.log("Making standard booking");
        }
      }


  }
 

  ngOnInit() {
  }
  /**
   * Grabs list of bookings for the selected environment for display
   */
  envChanged(){
    this.envBookings=[];
    this.bookingService.getBookingsByEnviroment(this.request.environment).subscribe(b=>{
      for(var i=0;i<b.length;i++){
        const start = new Date(b[i].startDate.seconds*1000);
        start.setHours(0);
        const end = new Date(b[i].endDate.seconds*1000);
        end.setHours(0);
        const booked = new Date(b[i].dateBooked.seconds*1000);
        booked.setHours(0);
        this.envBookings.push(new Booking(start,end,booked,b[i].name,b[i].email,this.request.environment,b[i].type));
        console.log(this.envBookings.length);
        }
    });  

  }


  //Ngbcalendar stuff

  /**
   * Updates values when a date is selected in the date picker
   * @param date Selected date
   */
  onDateSelection(date: NgbDate) {
    this.booked=false;
    this.pencilledBookings = [];
    this.selectedBooking = null;
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
    for(var i=0;i<this.envBookings.length;i++){
        if(tempDate.getTime()>=this.envBookings[i].startDate.getTime()
        &&tempDate.getTime()<=this.envBookings[i].endDate.getTime()
        && this.envBookings[i].type=='standard'){
          return true;
        }
    }
    return false;
  }

  /**
   * Checks if a date is currently booked
   * @param date 
   */
  isPencilled(date: NgbDate){
    var tempDate = new Date(date.year,date.month-1,date.day);
    for(var i=0;i<this.envBookings.length;i++){
        if(tempDate.getTime()>=this.envBookings[i].startDate.getTime()
        &&tempDate.getTime()<=this.envBookings[i].endDate.getTime()
        &&( this.envBookings[i].type=='pencil'
         ||this.envBookings[i].type=='pencil pending')){
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

    for(var i=0;i<this.envBookings.length;i++){
        if(tempDate.getTime()>=this.envBookings[i].startDate.getTime()
        &&tempDate.getTime()<=this.envBookings[i].endDate.getTime()){
          if(this.envBookings[i].type=='pencil'||this.envBookings[i].type=='pencil pending'){
            this.pencilledBookings.push(this.envBookings[i]);
          } else {
            this.selectedBooking = this.envBookings[i];
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