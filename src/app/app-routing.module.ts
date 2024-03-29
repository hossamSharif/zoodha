import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './auth/auth-gaurd.service';
const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGaurdService]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGaurdService]
  },
  {
    path: 'mazad-details',
    loadChildren: () => import('./mzad-details/mzad-details.module').then(m => m.MzadDetailsPageModule)
  },
   
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'select',
    loadChildren: () => import('./select/select.module').then( m => m.SelectPageModule)
  },
  {
    path: 'my-bidding',
    loadChildren: () => import('./my-bidding/my-bidding.module').then( m => m.MyBiddingPageModule)
  },
  {
    path: 'live-mzad',
    loadChildren: () => import('./live-mzad/live-mzad.module').then( m => m.LiveMzadPageModule)
  },
  {
    path: 'mzad-subescribe',
    loadChildren: () => import('./mzad-subescribe/mzad-subescribe.module').then( m => m.MzadSubescribePageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'change-phone',
    loadChildren: () => import('./change-phone/change-phone.module').then( m => m.ChangePhonePageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'err-modal',
    loadChildren: () => import('./err-modal/err-modal.module').then( m => m.ErrModalPageModule)
  },
  {
    path: 'virefy-rest',
    loadChildren: () => import('./virefy-rest/virefy-rest.module').then( m => m.VirefyRestPageModule)
  },
  {
    path: 'stripe-payment',
    loadChildren: () => import('./stripe-payment/stripe-payment.module').then( m => m.StripePaymentPageModule)
  },
  {
    path: 'pop-lang',
    loadChildren: () => import('./pop-lang/pop-lang.module').then( m => m.PopLangPageModule)
  },
  {
    path: 'curren-lang',
    loadChildren: () => import('./curren-lang/curren-lang.module').then( m => m.CurrenLangPageModule)
  },
  {
    path: 'stripe-charge-wallet',
    loadChildren: () => import('./stripe-charge-wallet/stripe-charge-wallet.module').then( m => m.StripeChargeWalletPageModule)
  },
  {
    path: 'subiscribe-wallet',
    loadChildren: () => import('./subiscribe-wallet/subiscribe-wallet.module').then( m => m.SubiscribeWalletPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
