import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  newUser = {
    email: '',
    password: '',
    displayName: ''
  }
  constructor(
    private router: Router,
    private userService: UserService,
    private alertCtrler: AlertController, private loaderCtrl: LoadingController

  ) { }

  ngOnInit() {

  }

  async signUp() {
    let load = await this.loaderCtrl.create({
      message: 'Please wait...',
      translucent: false
    });
    await load.present();
    this.userService.signUp(this.newUser).then(() => {
      load.dismiss();
      this.userService.SendVerificationMail().then(async (resp) => {
        if (resp == 1) {
          let alert = await this.alertCtrler.create({
            header: 'Alert',
            message: "Account registered successfully. Gmail access for authentication.",
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/signin'])
              }
            }],
          });
          await alert.present();
        }
      });
    }).catch(async (err) => {
      load.dismiss();
      let alert = await this.alertCtrler.create({
        header: 'Alert',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    })
  }

  backSignIn() {
    this.router.navigate([''])
  }
  goForgetPass() {
    this.router.navigate(['forgetpass'])
  }

}
