import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopLangPage } from './pop-lang.page';

const routes: Routes = [
  {
    path: '',
    component: PopLangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopLangPageRoutingModule {}
