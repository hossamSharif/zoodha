import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGaurdService } from '../auth/auth-gaurd.service';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule), canActivate: [AuthGaurdService]
      },
      {
        path: 'my-account',
        loadChildren: () => import('../my-account/my-account.module').then( m => m.MyAccountPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'my-bidding',
        loadChildren: () => import('../my-bidding/my-bidding.module').then( m => m.MyBiddingPageModule)
      },
      {
        path: 'wallet',
      loadChildren: () => import('../wallet/wallet.module').then( m => m.WalletPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
