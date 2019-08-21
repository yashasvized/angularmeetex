import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../socket.service';
import moment from 'moment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private appserve: AppService, private SocketService: SocketService) { }

  public title;
  public description;
  public timestart;
  public timeend;
  public id;
  public name;
  public adminName;
  public date;
  public currentdate;
  public admin;
  public disabled;
  public today;
  public adminNamet;

  ngOnInit() {
    this.verifyUserConfirmation();
    this.getMessageFromAUser();
    this.admin = Cookie.get("isAdmin")
    this.id = this.route.snapshot.paramMap.get('userId');
    this.name = this.route.snapshot.paramMap.get('userName');
    if (this.appserve.currentDay == null) {
      this.router.navigate(["/user", this.id, this.name])
    }
    this.today = this.appserve.currentDay;
    this.date = moment(this.appserve.currentDay).format('MMMM Do YYYY')
    this.adminName = Cookie.get('receiverName');
    if (this.appserve.title != null) {
      this.title = this.appserve.title;
      this.description = this.appserve.description;
      this.timestart = this.appserve.startTime
      this.timeend = this.appserve.endTime
      this.adminName = this.appserve.adminName;
      console.log(this.timeend)
    }
    if (this.admin == "true") {
      this.disabled = false
    } else {
      this.disabled = true;
    }
  }

  public verifyUser;
  public getmssg;
  public online;

  ngOnDestroy() {
    this.verifyUser.unsubscribe();
    this.getmssg.unsubscribe();
  }

  //verifying usersconfirmation
  public verifyUserConfirmation: any = () => {


    this.verifyUser = this.SocketService.verifyUser()
      .subscribe((data) => {

        console.log("hello");


        this.SocketService.setUser(Cookie.get('authtoken'));

      });
  }

  //for recieving message from user
  public getMessageFromAUser: any = () => {


    this.getmssg = this.SocketService.chatByUserId(Cookie.get('receiverId'))
      .subscribe((data) => {

        console.log(data);

        this.toastr.success("Some changes were made in meetings,go back");


      });//end subscribe

  }// end get message from a user 


  onSearchChange(searchValue: string) {
  }

  //goback to previos page
  goback() {
    this.appserve.currentDay = null;
    this.appserve.title = null;
    this.appserve.description = null;
    this.appserve.startTime = null
    this.appserve.endTime = null
    this.router.navigate(["/user", this.id, this.name])

  }

  //adds or edits the list of meetings
  makeThePlan() {
    console.log(this.title==null)
    if (!this.title.trim()) {
      this.toastr.warning("enter title")

    } else if (!this.description.trim()) {
      this.toastr.warning('enter description')


    } else if (!this.timestart) {
      this.toastr.warning('enter starting time')


    } else if (!this.timeend) {
      this.toastr.warning('enter ending time')


    } else if (this.timeend <= this.timestart) {
      this.toastr.warning('Starting time is greater than ending time')


    } else {
      let time = this.timestart.split(":")
      let hour = Number(time[0]);
      let min = Number(time[1]);
      this.appserve.currentDay.setHours(hour, min)
      let data = {
        title: this.title,
        description: this.description,
        timestart: this.appserve.currentDay,
        timeend: this.timeend,
        userId: this.id,
        currentDay: this.appserve.currentDay,
        meetId: this.appserve.meetId,
        adminEmail: this.appserve.getUserInfoFromLocalstorage().email,
        userEmail: this.appserve.userEmail,
        adminName: this.adminName,
        currName:Cookie.get("receiverName"),
        adminId: Cookie.get("receiverId")
      }
      let timeend = this.timeend.split(":")
      let hour1 = Number(timeend[0]);
      let min1 = Number(timeend[1]);
      console.log(this.timeend.split(":"))
      this.appserve.stopday.setHours(hour1, min1)
      data.timeend = this.appserve.stopday;
      console.log(data.timestart)
      console.log(data.timeend)
      this.appserve.addMeetingFunction(data).subscribe((apiResponse) => {
        console.log(apiResponse)
        if (apiResponse.status === 200) {
          let obj = {
            friendId: this.id,
            friendName: this.name,
            adminId: Cookie.get('receiverId'),
            adminName: Cookie.get('receiverName'),
            data: data,
            api: apiResponse.message
          }
          this.appserve.show=[];
          this.SocketService.SendChatMessage(obj)
          console.log(obj)
          this.appserve.currentDay = null;
          this.appserve.title = null;
          this.appserve.description = null;
          this.appserve.startTime = null
          this.appserve.endTime = null
          this.router.navigate(["/user", this.id, this.name])

        }
        else if(apiResponse.status == 405){
          this.router.navigate(["auth"])
      } else {
          this.toastr.error(apiResponse.message);

        }

      }, (err) => {
        console.log(err.error);
        if (err.error.status != 404) {
        }
        else {
        }
        this.toastr.error('some error occured');

      });
    }
  }


}
