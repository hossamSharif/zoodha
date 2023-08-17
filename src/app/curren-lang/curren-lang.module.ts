import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrenLangPageRoutingModule } from './curren-lang-routing.module';

import { CurrenLangPage } from './curren-lang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrenLangPageRoutingModule
  ],
  declarations: [CurrenLangPage]
})
export class CurrenLangPageModule {}
