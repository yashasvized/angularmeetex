import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) { }

  url = "http://api.tropp.site"

  public currentDay;
  public stopday;
  public title;
  public description;
  public startTime;
  public endTime;
  public meetId;
  public adminEmail;
  public userEmail;
  public adminName;
  public show = [];
  
  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))

  } // end setUserInfoFromLocalstorage


  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userName', data.userName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('isAdmin',data.isAdmin)
      .set('password', data.password)

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  public forgetPassword(data): Observable<any> {

    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/confirmation`,params);
  } // forget password.

  public getAllUsers1Function(): Observable<any> {

    return this.http.get(`${this.url}/api/v1/users/allusers`);

  } // end of getallusersFunction function.

  public addMeetingFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('title', data.title)
      .set('timestart',data.timestart)
      .set('timeend',data.timeend)
      .set('description',data.description)
      .set('currentDay',data.currentDay)
      .set('meetId',data.meetId)
      .set('userEmail',data.userEmail)
      .set('adminEmail',data.adminEmail)
      .set('adminName',data.adminName)
      .set('currName',data.currName)

    return this.http.post(`${this.url}/api/v1/users/meeting`, params);
  } // end of signinFunction function.

  public deleteMeetingFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('meetId',data.meetId)
      .set('title', data.title)
      .set('timestart',data.timestart)
      .set('timeend',data.timeend)
      .set('description',data.description)
      .set('meetId',data.meetId)
      .set('userEmail',data.userEmail)
      .set('adminEmail',data.adminEmail)
      .set('adminName',data.adminName)

    return this.http.post(`${this.url}/api/v1/users/deleteplans`, params);
  } // end of signinFunction function.

  public getMeetingFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)

    return this.http.post(`${this.url}/api/v1/users/meetingplans`, params);
  } // end of signinFunction function.


}
