import { Component, OnInit } from '@angular/core';
import { ConnReq } from '../services/user.model';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit {
  listUser = [];
  temparr = [];
  newReq = {} as ConnReq;
  constructor(private router: Router, private userService: UserService, private alertCtrl: AlertController,
    private toastCtrl: ToastController) { 
      this.userService.getNotFriends().then((resp: any) => {
        this.listUser = resp;
      })
      this.userService.getListUser().then((res: any) => {
        this.temparr = res;
      })

    }

  ngOnInit() {
  }

  searchuser(searchbar) {
    this.listUser = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.listUser = this.listUser.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  async sendreq(recipient) {
    this.newReq.sender = firebase.auth().currentUser.uid;
    this.newReq.recipient = recipient.uid;
    if (this.newReq.sender === this.newReq.recipient) {
      let alert = await this.toastCtrl.create({
        message: 'This is your Nickname!',
        duration: 2000
      });
      await alert.present();
    } else {
      let successalert = await this.alertCtrl.create({
        header: 'Request sent',
        message: 'Your request was sent to ' + recipient.displayName,
        buttons: ['OK']
      });
      await successalert.present();
      this.userService.sendRequest(this.newReq).then((res: any) => {
        if (res.success) {
          let sentuser = this.listUser.indexOf(recipient);
          this.listUser.splice(sentuser, 1);
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  backListFriends() {
    this.router.navigate(['/friends'])
  }

}

