 
  
import { NavigationExtras, Route  } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SocketServiceService } from '../services/socket-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  errorLoad:boolean = false
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
};

 orders:Array<any> = undefined
 showEmpty : boolean = false
 showSkelton :boolean = false
 higtPayedPrie: any = 0
  constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) {
   
   }

  ngOnInit() {
    
  }
 
  ionViewDidEnter(){
    this.storage.get('user_info').then((response) => {
      if (response) {
        this.USER_INFO = response.user
        console.log('kkkkkkkkkk',this.USER_INFO) 
        this.getOrders()  
      }
     });
  }


  reload(){
    this.errorLoad = false
    this.orders = undefined
    this.getOrders()
    }

    
    getOrders(){ 
    this.showSkelton = true
    this.api.getUserOrder(this.USER_INFO._id).subscribe(data =>{
      console.log(data)
      let res = data['orders'] 
      this.orders = res
      if(res.length == 0){
        this.showEmpty
      }else{ 
        this.preparOrders()
      }
     
    //   this.mzd = data['auction'][0][0]
    //   this.users = data['auction'][1]
    //   console.log('im here baby',this.mzd , 'users',this.users)
    //  this.prepareAuc()
    }, (err) => {
     this.errorLoad = true
    console.log(err);
  },()=>{
    this.showSkelton = false 
  })  
 } 

 preparOrders(){
  this.orders.forEach(element => {
    let arr = element['auctions'][0].logs.sort((a, b) => (a.pay > b.pay ? -1 : 1)) 
    let winer = arr
    element.higtPayedPrie = winer[0].pay
  });
 }

 orderDetailsPage(orderId){
  let navigationExtras: NavigationExtras = {
    queryParams: {
      id: JSON.stringify(orderId),
      user_info: JSON.stringify(this.USER_INFO )
    }
};
  this.rout.navigate(['order-details'],navigationExtras);
 }


  // async presentModal(id?, status?) { 
    
  //   const modal = await this.modalController.create({
  //     component: OrderDetailsPage ,
  //     componentProps: {
  //       "item":"",
  //       "status": ""
  //     }
  //   });
    
  //   modal.onDidDismiss().then((dataReturned) => {
  //     if (dataReturned !== null) {
  //       console.log(dataReturned )
  //       this.doAfterDissmiss(dataReturned)
  //     }
  //   });
 
  //   return await modal.present(); 
  // }

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

  //  subiscribe(){
  //   this.presentModal()
  //  }

}
