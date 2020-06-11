import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.page.html',
  styleUrls: ['./forgetpass.page.scss'],
})
export class ForgetpassPage implements OnInit {

  email: any;
  constructor(private router:Router, private userService: UserService) { }

  ngOnInit() {
  }
  sendRecoverPass() {
    this.userService.PasswordRecover(this.email).then(() => {
      this.router.navigate(['mess']);
    }).catch((err) => {
      console.log(err.message);
    })
  }
  backMess(){
    this.router.navigate([''])
  }
  goSignUp(){
    this.router.navigate(['signup'])
  }

}
