import { Component, NgZone } from '@angular/core';
import { ConnReq } from '../services/user.model';
import { Router } from '@angular/router';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userData: any;
  lengthReq: any;
  myRequest = [];
  myFriends = [];
  temparr = [];
  newReq = {} as ConnReq;

  constructor(private router: Router, private userService: UserService, private zone: NgZone,
    private modalCtrl: ModalController, private toastCtrl: ToastController, private alertCtrl: AlertController
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.userService.getListChatted(this.userData.uid).then((resp: any) => {
      this.myFriends = resp;
      this.temparr = resp;
    });
    this.userService.getMyRequests().then((res: any) => {
      this.myRequest = res;
      this.lengthReq = this.myRequest.length;
    });
  }

  ngOnInit() {
  }

  async opentModal() {
    const modal = await this.modalCtrl.create({
      component: NotificationPage
    });
    return await modal.present();
  }

  searchuser(searchbar) {
    this.myFriends = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.myFriends = this.myFriends.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }

  buddyChat(buddy) {
    this.userService.initializeBuddy(buddy);
    this.router.navigate(['/buddychat'])
  }

  deleteMess(friend) {
    this.userService.deleteBuddyChat(friend).then(async () => {
      let toastF = await this.toastCtrl.create({
        message: 'This is buddy chat removed!!!',
        duration: 2000,
      });
      this.userService.getListChatted(this.userData.uid).then((resp: any) => {
        this.myFriends = resp;
        this.temparr = resp;
      });
      await toastF.present();
    }).catch(async (err) => {
      let alert = this.alertCtrl.create({
        header: 'Alert',
        message: err.message,
        buttons: [{
          text: 'OK'
        }]
      });
      (await alert).present();
    })
  }

  openUser() {
    this.router.navigate(['/user'])
  }

}
