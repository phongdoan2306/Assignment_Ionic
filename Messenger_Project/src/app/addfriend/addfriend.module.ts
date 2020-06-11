import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddfriendPageRoutingModule } from './addfriend-routing.module';

import { AddfriendPage } from './addfriend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddfriendPageRoutingModule
  ],
  declarations: [AddfriendPage]
})
export class AddfriendPageModule {}
