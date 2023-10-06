import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubiscribeWalletPage } from './subiscribe-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: SubiscribeWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubiscribeWalletPageRoutingModule {}
