import { Component, OnInit } from '@angular/core';
import { UserCreds } from '../services/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  user = {} as UserCreds;
  userData: any;

  constructor(
    private router: Router, private userService: UserService,
    private alertCtrl: AlertController, private loaderCtrl: LoadingController) { }

  ngOnInit() {
    
  }

  async signIn() {
    let load = await this.loaderCtrl.create({
      message: 'Please wait...',
      translucent: false
    });
    await load.present();
    this.userService.signIn(this.user).then(async (res) => {
      load.dismiss();
      if (this.userService.isEmailVerified) {
        this.userService.updateVerificationMail(); 
        this.router.navigate(['/home']);
      } else {
        load.dismiss();
        let alert = await this.alertCtrl.create({
          header: 'Alert',
          message: 'Email is not verified.',
          buttons: ['OK']
        });
        await alert.present();
        return false
      }
    }).catch(async (error) => {
      load.dismiss();
      let alert = await this.alertCtrl.create({
        header: 'Alert',
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
    })
  }


}
