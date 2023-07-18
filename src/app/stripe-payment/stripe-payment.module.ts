import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripePaymentPageRoutingModule } from './stripe-payment-routing.module';

import { StripePaymentPage } from './stripe-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripePaymentPageRoutingModule
  ],
  declarations: [StripePaymentPage]
})
export class StripePaymentPageModule {}
