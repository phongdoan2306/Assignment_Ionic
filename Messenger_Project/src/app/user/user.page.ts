import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  @ViewChild(IonContent, { read: ElementRef, static: true }) contentArea: ElementRef;
  @ViewChild('triggerElement', { read: ElementRef, static: true }) triggerElement: ElementRef;
  private observer: IntersectionObserver;

  userData: any;

  constructor(private userService: UserService, private router: Router, public actionSheetController: ActionSheetController,
    private renderer: Renderer2, public alertController: AlertController
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          // console.log("adding class");
          this.renderer.addClass(this.contentArea.nativeElement, "no-transform")
        } else {
          // console.log("removing class");
          this.renderer.removeClass(this.contentArea.nativeElement, "no-transform")
        }
      })
    });
    this.observer.observe(this.triggerElement.nativeElement);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Thông Báo & Âm Thanh',
      buttons: [{
        text: 'Tắt 1h',
        role: 'destructive',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Tắt 2h',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Tới Khi Mở lại',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  backChat() {
    this.router.navigate(["home"])
  }

  goDetailInfor() {
    this.router.navigate(['/detail'])
  }

  logOut() {
    this.userService.SignOut().then(() => {
      localStorage.removeItem('user');
    });
    this.router.navigate(['/signin'])
  }


}
