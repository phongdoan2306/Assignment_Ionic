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
  constructor (
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
    this.userService.signUp(this.newUser).then((res: any) => {
      load.dismiss();
      this.router.navigate(['/home']);
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

  backMess() {
    this.router.navigate([''])
  }
  goForgetPass() {
    this.router.navigate(['forgetpass'])
  }

}
