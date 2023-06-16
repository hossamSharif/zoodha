import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VirefyRestPage } from './virefy-rest.page';

const routes: Routes = [
  {
    path: '',
    component: VirefyRestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirefyRestPageRoutingModule {}
