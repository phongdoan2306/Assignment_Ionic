import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  userData: any;
  myFriends = [];
  temparr = [];
  constructor(private userService: UserService, private router: Router) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.userService.getMyFriends().then((res: any) => {
      this.myFriends = res;
      this.temparr = res;
    });
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

