import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  displayName: any;
  userData: any;
  photoUrl: any;

  constructor(private router: Router, private userService: UserService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private zone: NgZone
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.displayName = this.userData.displayName;
    this.photoUrl = this.userData.photoURL;
  }

  ngOnInit() {

  }

  async editImage(files: FileList) {
    let load = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: false
    });
    await load.present();
    this.photoUrl = files.item(0);
    await this.userService.updateImage(this.photoUrl).then((url: any) => {
      this.photoUrl = url;
      this.userService.removeUserOnLocal();
      this.userService.setUserOnLocal();
      load.dismiss();
    }).catch((err) => {
      console.log(err.message);
    })
  }

  async editname() {
    let alert = await this.alertCtrl.create({
      header: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.nickname) {
            this.userService.updateDisplayName(data.nickname).then(async (res: any) => {
              if (res.success) {
                let toast = await this.loadingCtrl.create({
                  message: 'Your settings have been saved.',
                  duration: 2000
                });
                await toast.present();
                this.zone.run(() => {
                  this.displayName = data.nickname;
                  this.userService.removeUserOnLocal();
                  this.userService.setUserOnLocal();
                });
              }
              else {
                let toast = await this.loadingCtrl.create({
                  message: 'Your update failed.',
                  duration: 2000
                });
                await toast.present();
              }
            })
          }
        }
      }]
    });
    alert.present();
  }

  backSetting() {
    this.router.navigate(["/user"])
  }
}
