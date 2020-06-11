import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-buddychat',
  templateUrl: './buddychat.page.html',
  styleUrls: ['./buddychat.page.scss'],
})
export class BuddychatPage implements OnInit {

  userData: any;
  buddy: any;
  message = '';
  messages = [];
  currentUser = '';

  constructor(private router: Router, private userService: UserService, private zone: NgZone,
    private socket: Socket, private toastCtrl: ToastController
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.buddy = userService.buddy;
    this.currentUser = this.userData.uid;
    this.userService.getBuddyMessages().then((res: any) => {
      this.messages = res;
    });
  }

  ngOnInit() {
    this.socket.emit('set-name', this.userData.displayName);
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
      console.log(message);
      console.log(this.messages);
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message, sentby: this.userData.uid });
    this.userService.addNewMessage(this.message).then((res: any) => {
      console.log(this.message);
      if(res){
        this.message = '';
      }
    })
  }

  backHome() {
    this.router.navigate(['/home'])
  }

}
