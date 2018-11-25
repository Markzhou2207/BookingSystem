export class Booking {
    public startDate: Date;
    public endDate: Date;
    public ownerName: string;
    public ownerEmail:string;
    public environment: string;
    public dateBooked: Date;
    public bookingType: string;
    constructor(private start: Date, private end: Date,private booked: Date, private name: string,public email: string, private env: string, private type: string){
        this.startDate=start;
        this.endDate=end;
        this.dateBooked=booked;
        this.environment=env;
        this.ownerName = name;
        this.ownerEmail = email;
        this.bookingType=type;
    }
}
