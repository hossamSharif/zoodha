import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeChargeWalletPageRoutingModule } from './stripe-charge-wallet-routing.module';

import { StripeChargeWalletPage } from './stripe-charge-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripeChargeWalletPageRoutingModule
  ],
  declarations: [StripeChargeWalletPage]
})
export class StripeChargeWalletPageModule {}
