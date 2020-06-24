import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { ScrollToBottomDirective } from '../services/scroll-to-bottom.directive';

@Component({
  selector: 'app-buddychat',
  templateUrl: './buddychat.page.html',
  styleUrls: ['./buddychat.page.scss'],
})
export class BuddychatPage implements OnInit {
  
  @ViewChild(ScrollToBottomDirective)
  scroll : ScrollToBottomDirective;

  userData: any;
  buddy: any;
  message: any;
  messages = [];
  currentUser = '';

  constructor(private router: Router, private userService: UserService,
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
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message, sentby: this.userData.uid, isImaged: this.isImaged() });
    this.userService.addNewMessage(this.message, this.isImaged()).then((res: any) => {
      if (res) {
        this.message = '';
      }
    });
  }

  sendImage(files: FileList) {
    let photoData = files.item(0);
    this.userService.uploadImage(photoData).then((url) => {
      this.message = url;
    });
  }

  isImaged() {
    let result = this.message.match('^https:\/\/firebase.*$');
    if (result == null) {
      return false;
    } else {
      return true;
    }
  }
  
  backHome() {
    this.router.navigate(['/home'])
  }

}
