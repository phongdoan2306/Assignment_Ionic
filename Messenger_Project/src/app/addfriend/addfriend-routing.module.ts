import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddfriendPage } from './addfriend.page';

const routes: Routes = [
  {
    path: '',
    component: AddfriendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddfriendPageRoutingModule {}
