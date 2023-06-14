import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrModalPageRoutingModule } from './err-modal-routing.module';

import { ErrModalPage } from './err-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrModalPageRoutingModule
  ],
  declarations: [ErrModalPage]
})
export class ErrModalPageModule {}
