import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubiscribeWalletPageRoutingModule } from './subiscribe-wallet-routing.module';

import { SubiscribeWalletPage } from './subiscribe-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubiscribeWalletPageRoutingModule
  ],
  declarations: [SubiscribeWalletPage]
})
export class SubiscribeWalletPageModule {}
