import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrModalPage } from './err-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ErrModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrModalPageRoutingModule {}
