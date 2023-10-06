import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VirefyRestPageRoutingModule } from './virefy-rest-routing.module';

import { VirefyRestPage } from './virefy-rest.page';
import {TranslateModule} from '@ngx-translate/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, 
    VirefyRestPageRoutingModule,
    TranslateModule
  ],
  declarations: [VirefyRestPage]
})
export class VirefyRestPageModule {}
