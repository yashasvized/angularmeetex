import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './User managment/signup/signup.component';
import { LoginComponent } from './User managment/login/login.component';
import { ForgetComponent } from './User managment/forget/forget.component';
import { AppService } from './app.service';

import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from "@angular/material/icon";
import { DetailsComponent } from './details/details.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoogleChartsModule } from 'angular-google-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4'); // or 'bs4'

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ForgetComponent,
    UserComponent,
    AdminComponent,
    HeaderComponent,
    DetailsComponent,
    NotfoundComponent,
    AuthorizeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    Ng2GoogleChartsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forRoot([
      {path:"",component:LoginComponent},
      {path:"signup",component:SignupComponent},
      {path:"forget",component:ForgetComponent},
      {path:"auth",component:AuthorizeComponent},
      {path:"user/:userId/:userName",component:UserComponent},
      {path:"admin/:userId",component:AdminComponent},
      {path:"user/:userId/:userName/detail",component:DetailsComponent},
      {path:"**",component:NotfoundComponent},
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
