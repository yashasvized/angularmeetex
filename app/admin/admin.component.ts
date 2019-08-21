import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userList;
  public load = true;

  constructor(private appservice: AppService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.getAllUsersFunction();
    if(Cookie.get("receiverId")==null){
      this.router.navigate(["auth"])
    }
  }

  //get all normal users
  public getAllUsersFunction: any = () => {
    {


      this.appservice.getAllUsers1Function()
        .subscribe((apiResponse) => {

          console.log(apiResponse.data)
          this.load = false;

          if (apiResponse.status === 200) {
            this.userList = apiResponse.data;
          }
          else {

            console.log('some error occured');
          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
