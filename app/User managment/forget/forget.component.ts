import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

  constructor(private router: Router, private appserve: AppService, private toastr: ToastrService) { }


  public email: any;
  public password: any;
  public error: any;
  public empty;
  ngOnInit() {
  }

  onSearchChange(searchValue: string) {
    this.error = "";
    this.empty = ""
  }
  
  //send a link in thier email to update thier password
  forget() {
    if (!this.email) {
      this.toastr.warning("enter email")

    } else if (!this.password) {
      this.toastr.warning('enter password')

    } else if (this.password.length < 7) {
      this.toastr.warning('enter password more than 7 characters')


    } else {

      let data = {
        email: this.email,
        password: this.password,
      }
      this.appserve.forgetPassword(data).subscribe((apiresponse) => {
        if (apiresponse.status = 200) {


          console.log(apiresponse);
          this.toastr.success('Email sent,please click on it to update your password!(check in spam folder also)')
        } else {
          this.toastr.warning('Please register your email account!')
        }
      }, (err) => {
        this.toastr.warning('Please register your email account!')
      })
    }
  }
}