import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveMzadPageRoutingModule } from './live-mzad-routing.module';

import { LiveMzadPage } from './live-mzad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveMzadPageRoutingModule
  ],
  declarations: [LiveMzadPage]
})
export class LiveMzadPageModule {}
