import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  myRequest = [];

  constructor(private modalCtrl: ModalController, private userService: UserService, private zone: NgZone,
    private alertCtrl: AlertController, private toastCtrl: ToastController
  ) {
    this.userService.getMyRequests().then(() => {
      this.myRequest = this.userService.userdetails;
    });
  }

  ngOnInit() {

  }

  async accept(item) {
    this.userService.acceptReq(item).then(async (res: any) => {
      if (res) {
        let toast = await this.toastCtrl.create({
          message: 'Tap on the friend to chat with him',
          duration: 2000
        });
        this.zone.run(() => {
          this.userService.getMyRequests().then((resp: any) => {
            this.myRequest = resp;
          })
        })
        await toast.present();
      }
    })
  }

  async ignore(item) {
    this.userService.deleteReq(item).then(async () => {
      let toastF = await this.toastCtrl.create({
        message: 'Request removed!!!',
        duration: 2000
      });
      await toastF.present();
    }).catch((err) => {
      console.log(err);
    })
  }


  async closeModal() {
    await this.modalCtrl.dismiss();
    this.zone.run(() => {
      this.userService.getMyRequests().then((res: any) => {
        this.myRequest = res;
      })
    })
  }


}
