import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import * as CanvasJS from './canvasjs.min';
import moment from 'moment';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown = false;
  public load = true;
  public loadchart = true;
  public ccComponent;
  public ccWrapper;
  public intervals = [];
  public counters = [];

  showModal(): void {

    this.isModalShown = true;

  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }
  modalRef: BsModalRef;
  public selectedDay;
  public newevent;
  public chart;
  public tempdata = [];
  public verifyUser;
  public getmssg;
  public online;
  public mod;
  public admin;
  public plan;
  public today = new Date;
  public show = false;
  public alertmeet = [];
  public month = false;
  public month1 = false
  public bool = true;
  modelDate = "";
  minDate: Date;
  maxDate: Date;
  currdate:Date

  ngOnInit() {
    this.currdate = new Date;
    this.minDate = new Date(this.currdate.getFullYear(),0);
    this.maxDate = new Date(this.currdate.getFullYear(),11);
    if(Cookie.get("receiverId")==null){
      this.router.navigate(["auth"])
    }
    this.getcurrentMeetingsFunction();
    this.onhide()
    this.verifyUserConfirmation();
    this.getMessageFromAUser();
    this.admin = Cookie.get("isAdmin")
    var Header = ['Activity', 'Start Time', 'End Time'];
    this.tempdata.push(Header);
    if (this.admin == 'true') {
      this.plan = "Edit plan"
    } else {
      this.plan = "View Details"
    }
    this.appserve.currentDay = null;
    this.appserve.title = null;
    this.appserve.description = null;
    this.appserve.startTime = null
    this.appserve.endTime = null
  }
  ngOnDestroy() {
    this.verifyUser.unsubscribe();
    this.getmssg.unsubscribe();
    this.mod.unsubscribe();
  }

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private modalService: BsModalService, private router: Router, private appserve: AppService, private toastr: ToastrService, private route: ActivatedRoute, private appservice: AppService, private SocketService: SocketService) { }

  check(data) {
    console.log(data)
    console.log("gg")
  }
  drawonce() {
    if (this.bool == true) {
      this.bool = false
      this.ccComponent.draw();
      console.log("gg")
    }

  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
      this.viewDate = event.date;
      if(this.viewDate.getMonth()==0){
        this.month = true;
        this.month1 = false;
      }
      else if(this.viewDate.getMonth()==11){
        this.month1 = true;
        this.month = false;
      }else{
        this.month = false;
        this.month1 = false;
      }
    };     
    container.setViewMode('month');
   }
  //For emiting event setuser and verifying socket connection
  public verifyUserConfirmation: any = () => {


    this.verifyUser = this.SocketService.verifyUser()
      .subscribe((data) => {

        console.log("hello");


        this.SocketService.setUser(Cookie.get('authtoken'));

      });
  }

  //for recieving notification and updating list
  public getMessageFromAUser: any = () => {


    this.getmssg = this.SocketService.chatByUserId(Cookie.get('receiverId'))
      .subscribe((data) => {

        console.log(data);

          this.modalRef.hide();
        if (data.api == "update") {
          this.toastr.success(`Meeting ${data.data.title} is updated`);
          this.events = [];
          this.getcurrentMeetingsFunction();
        } else if (data.api == "create") {
          this.toastr.success(`New Meeting ${data.data.title} is created`);
          this.events = [];
          this.getcurrentMeetingsFunction();
        } else {
          for (let j = 0; j < this.intervals.length; j++) {
            if (this.intervals[j].meetId == data.data.meetId) {
              clearTimeout(this.intervals[j].timeout[this.intervals[j].event])
              console.log("gg")
            }
          }
          console.log(this.events);
          this.toastr.success(`Meeting deleted ${data.data.title}`);
          setTimeout(() => {
            this.getcurrentMeetingsFunction();
            console.log(this.events);
          }, 100);
        }

      });//end subscribe

  }// end get message from a user 


  //clicking a date in calender
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = false;
      }
      this.selectedDay = events;
      console.log(this.selectedDay)
      this.today = date;
      this.viewDate = date;
      this.appserve.currentDay = date;
      this.appserve.stopday = new Date(date);
    }
  }

  //an event triggered when modal hides
  onhide() {
    this.mod = this.modalService.onHide.subscribe((reason: string) => {
      while (this.tempdata.length != 1) {
        this.tempdata.pop();
      }
      this.bool = true;
      this.appserve.currentDay = null
      console.log(this.tempdata);
    })
  }

  //Deleting a meeting in calender
  delete(eve, i) {
    let obj = {
      friendId: this.route.snapshot.paramMap.get('userId'),
      adminId: Cookie.get('receiverId'),
      adminName: Cookie.get('receiverName'),
      data: eve,
      api: "delete"
    }
    for (let j = 0; j < this.intervals.length; j++) {
      if (this.intervals[j].meetId == eve.meetId) {
        clearTimeout(this.intervals[j].timeout[this.intervals[j].event])
        console.log("gg")
      }
    }

    this.SocketService.SendChatMessage(obj)
    this.deletecurrentMeetingsFunction(eve);
    this.selectedDay.splice(i, 1)
    console.log(this.tempdata);
    this.tempdata.splice(i + 1, 1);
    console.log(this.tempdata);
    this.myfunction();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  //restricts user from going to other yaer than current one
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    console.log(this.month)
    if (this.viewDate.getMonth() == 0) {
      this.month = true;
    } else if (this.viewDate.getMonth() == 11) {
      this.month1 = true;
    } else {
      this.month = false;
      this.month1 = false;
    }
  }

  //google chart graph
  public timelineChartData: any = {
    chartType: 'Timeline',
    options: {
      hAxis: {
        format: 'HH:mm',
        minValue: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0),
        maxValue: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 23, 59)
      }
    },

    dataTable: this.tempdata
  }

  //google chart redraw function
  myfunction() {
    let ccComponent = this.timelineChartData.component;
    let ccWrapper = ccComponent.wrapper;

    //force a redraw
    ccComponent.draw();
  }

  //edit a meeting
  editplan(eve) {
    this.appserve.title = eve.title;
    this.appserve.description = eve.description;
    this.appserve.meetId = eve.meetId;
    this.appserve.adminName = eve.adminName;
    let newmoment = moment(eve.start).format("HH:mm")
    let newmoment1 = moment(eve.end).format("HH:mm")
    this.appserve.startTime = newmoment;
    this.appserve.endTime = newmoment1;
    this.router.navigate([this.router.url, "detail"])
  }
  ready(event) {
    this.loadchart = false
    this.ccComponent = this.timelineChartData.component;
    this.ccWrapper = this.ccComponent.wrapper;
    this.ccComponent.options.hAxis.minValue = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0),
      this.ccComponent.options.hAxis.maxValue = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 23, 59)
    this.drawonce();
  }

  //open current date modal
  openModal(template: TemplateRef<any>) {

    let curremtevemts = this.events
    for (var i = 0; i < curremtevemts.length; i++) {
      console.log(this.appserve.currentDay)
      if (this.appserve.currentDay !== undefined) {
        if (this.events[i].start.getDate() == this.appserve.currentDay.getDate()) {
          var temp = [];
          temp.push(curremtevemts[i].title);
          temp.push(curremtevemts[i].start);
          temp.push(curremtevemts[i].end);
          console.log(this.tempdata)

          this.tempdata.push(temp);
        }
      }
    }
    if (this.appserve.currentDay != null)
      this.modalRef = this.modalService.show(template,
        {
          class: 'modal-dialog-centered'
        });
  }

  //goto the details page
  gotodetailsPage(template: TemplateRef<any>) {
    this.appserve.meetId = null;
    this.router.navigate([this.router.url, "detail"])
  }
 
  //snooze a meeting
  confirm() {
    this.hideModal();

    setTimeout(() => {
      this.showModal()
    }, 5000);
  }
  //confirm a meeting
  decline() {
    this.hideModal();
    this.show = false;
    this.alertmeet = [];
  }

  //gets the current meetings and also maps them in calendar
  public getcurrentMeetingsFunction: any = () => {
    {

      let data = {
        userId: this.route.snapshot.paramMap.get('userId')
      }
      for (let i = 0; i < this.intervals.length; i++) {
        clearTimeout(this.intervals[i].timeout);
      }
      this.intervals = [];
      this.appserve.getMeetingFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse.data)

          console.log();
          this.load = false;
          this.events = [];

          if (apiResponse.status === 200) {
            this.appserve.userEmail = apiResponse.data[0].email;
            console.log(this.appserve.userEmail)
            for (let i = 0; i < apiResponse.data[0].meeting.length; i++) {
              let dt = new Date(apiResponse.data[0].meeting[i].timestart);
              dt.setMinutes(dt.getMinutes() - 330);
              let dt1 = new Date(apiResponse.data[0].meeting[i].timeend);
              dt1.setMinutes(dt1.getMinutes() - 330);
              let color = colors.red;
              for (let j = 0; j < this.events.length; j++) {
                console.log("gg")
                if (this.events[j] != null && this.events[j].start < dt1 && dt < this.events[j].end) {
                  this.events[j].color = colors.yellow
                  color = colors.yellow;
                }
              }

              this.events = [
                ...this.events,
                {
                  title: apiResponse.data[0].meeting[i].title,
                  start: dt,
                  end: dt1,
                  color: color,
                  adminName: apiResponse.data[0].meeting[i].adminName,
                  meetId: apiResponse.data[0].meeting[i].meetId,
                  description: apiResponse.data[0].meeting[i].description,
                  draggable: false,
                  resizable: {
                    beforeStart: true,
                    afterEnd: true
                  }

                }]

            }
            if (this.events.length > 0) {
              let counters = [];
              let p = new Date;
              let tim = []
              for (let i = 0; i < this.events.length; i++) {
                let newdate = new Date(this.events[i].start);
                newdate.setMinutes(this.events[i].start.getMinutes() - 1);
                console.log(newdate.getTime());
                console.log(newdate)
                console.log(p.getTime())
                let timeleft = newdate.getTime() - p.getTime();
                console.log(timeleft)
                if (timeleft < 0 && timeleft > -59999) {
                  console.log(timeleft)
                  timeleft = 0;
                }
                let currevent = this.events;
                tim[i] = setTimeout(() => {
                  if (timeleft >= 0  && this.appserve.show[i]!=false) {
                    this.alertmeet.push(currevent[i]);
                    if (this.show == false) {
                      this.show = true;
                      this.appserve.show[i]=false;
                      console.log(timeleft)
                      console.log(this.alertmeet)
                      this.showModal()
                    }
                  } else if (timeleft < 0) {
                    //clearTimeout(tim)
                  }
                  console.log(timeleft)
                }, timeleft);
                this.intervals.push({ timeout: tim[i], event: i, meetId: this.events[i].meetId })
                console.log(timeleft)
              }
              console.log(this.intervals)
            }
          }
          else {

            console.log('some error occured');
          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end getcurrentmeeting


  //deletes meeting function
  public deletecurrentMeetingsFunction: any = (eve) => {
    {

      let data = {
        userId: this.route.snapshot.paramMap.get('userId'),
        meetId: eve.meetId,
        adminId: Cookie.get("receiverId"),
        adminName: Cookie.get("receiverName"),
        title: eve.title,
        description: eve.description,
        timestart: eve.timestart,
        timeend: eve.timeend,
        adminEmail: this.appserve.getUserInfoFromLocalstorage().email,
        userEmail: this.appserve.userEmail,

      }
      this.appserve.deleteMeetingFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse.data)


          if (apiResponse.status === 200) {
            this.events = [];
            this.getcurrentMeetingsFunction();
          }
          else if(apiResponse.status == 405){
            this.router.navigate(["auth"])
        }
          else {

            console.log('some error occured');
          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end deletemeetingfunctin
}
