import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuddychatPageRoutingModule } from './buddychat-routing.module';

import { BuddychatPage } from './buddychat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuddychatPageRoutingModule
  ],
  declarations: [BuddychatPage]
})
export class BuddychatPageModule {}
