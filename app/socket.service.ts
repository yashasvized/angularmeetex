import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  public onlineList= [];


  constructor() { 
    this.socket = io("http://api.tropp.site");
    console.log("hello");
  }

  ngOnInit() {
  }


   // events to be listened 

   public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser
  
  

  public chatByUserId = (userId,Id?:any) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        console.log("gggg")

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId

  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  } // end sendChatMessage

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public authfailed = () => {

    return Observable.create((observer) => {

      this.socket.on("auth-error", (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket
}
