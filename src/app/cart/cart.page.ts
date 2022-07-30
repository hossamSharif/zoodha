import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OrderDetailsPage } from '../order-details/order-details.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(private rout : Router,private loadingController:LoadingController , private toast:ToastController,private actionSheetCtl:ActionSheetController ,private modalController:ModalController) { }

  ngOnInit() {
  }

  async presentModal(id?, status?) { 
    
    const modal = await this.modalController.create({
      component: OrderDetailsPage ,
      componentProps: {
        "item":"",
        "status": ""
      }
    });
    
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log(dataReturned )
        this.doAfterDissmiss(dataReturned)
      }
    });
 
    return await modal.present(); 
  }

   doAfterDissmiss(dataReturned){
    this.presentToast("تم سداد المفاتورة  بنجاح , يمكنك متابعة طلبك " ,'success')
    // this.rout.navigate(['cart']);  
   }

   async presentLoadingWithOptions(msg?) {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      mode:'ios',
      duration: 5000,
      message: msg,
      translucent: true,
     // cssClass: 'custom-class custom-loading',
      backdropDismiss: false
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }
  

   async presentToast(msg,color?) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
      color:color,
      cssClass:'cust_Toast',
      mode:'ios',
      position:'top' 
    });
    toast.present();
  }

   subiscribe(){
    this.presentModal()
   }

}
