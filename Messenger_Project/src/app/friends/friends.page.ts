import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  userData: any;
  myFriends = [];
  temparr = [];

  constructor(private userService: UserService, private router: Router, private toastCtrl: ToastController,
    private zone: NgZone
    ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.myFriends = JSON.parse(localStorage.getItem('friends'));
    this.temparr = JSON.parse(localStorage.getItem('friends'));
  }

  ngOnInit() {
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
    })
  }

  deleteFriend(friend) {
    this.userService.deleteFriend(friend.uid).then(async (snap) => {
      let load = await this.toastCtrl.create({
        message: 'This is friend removed!!!',
        duration: 2000,
      });
       this.zone.run(() => {
         this.userService.getMyFriends().then((resp: any) => {
           this.myFriends = resp;
           this.temparr = resp;
         })
       })
      await load.present();
    }).catch((err) => {
      console.log(err.message);
    })
  }

  buddyChat(buddy) {
    this.userService.initializeBuddy(buddy);
    this.router.navigate(['/buddychat'])
  }

  goUserInfor() {
    this.router.navigate(['/user'])
  }

  goAddFriends() {
    this.router.navigate(['/addfriend'])
  }

}

