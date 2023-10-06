import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPasswordPageRoutingModule } from './new-password-routing.module';

import { NewPasswordPage } from './new-password.page';
import {TranslateModule} from '@ngx-translate/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewPasswordPageRoutingModule,
    TranslateModule
  ],
  declarations: [NewPasswordPage]
})
export class NewPasswordPageModule {}
