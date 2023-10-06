import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripeChargeWalletPage } from './stripe-charge-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: StripeChargeWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeChargeWalletPageRoutingModule {}
