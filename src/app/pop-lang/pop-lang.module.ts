import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopLangPageRoutingModule } from './pop-lang-routing.module';

import { PopLangPage } from './pop-lang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopLangPageRoutingModule
  ],
  declarations: [PopLangPage]
})
export class PopLangPageModule {}
