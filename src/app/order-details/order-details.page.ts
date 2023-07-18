import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocketServiceService } from '../services/socket-service.service';
import { StripePaymentPage } from '../stripe-payment/stripe-payment.page';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  errorLoad:boolean = false
  orderId:any
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
    };

    order:any = undefined
    higtPayedPrie: any = 0 
    showEmpty : boolean = false
    showSkelton :boolean = false

    walletBalance:any
    trasaction : {_id:any,orderId:any , userId:any , auctId:any , currentStatus:0 ,typee:1 , pay:0 ,details , comment ,fromAccount:any,toAccount:any,fromAccountTitle:any,toAccountTitle:any}
  constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) { 
    this.route.queryParams.subscribe(params => {
      console.log('params',params)
      if (params && params.id) {
        this.USER_INFO = JSON.parse(params.user_info);
        this.orderId = JSON.parse(params.id) 
        console.log( this.orderId)
        this.getOrder()
      }
    });  
  }
 

  reload(){
    this.errorLoad = false
    this.order = undefined
    this.getOrder()
    }


  getOrder(){
    this.showSkelton = true 
    this.api.getOrder(this.orderId).subscribe(data =>{
      console.log(data)
      let res = data['order'][0]
      this.order = res
      console.log(this.order) 
      this.preparOrders() 
    }, (err) => {
    console.log(err);
    this.errorLoad = true
  } ,
  ()=>{
    this.showSkelton = false
  })  
 } 

 getWalletBalance(){
  this.showSkelton = true 
  this.api.getBalance(this.USER_INFO._id).subscribe(data =>{
    console.log(data)
     let res = data['transaction'][0]
     this.walletBalance = res.balance
  }, (err) => {
  console.log(err);
} ,
()=>{ 
})  
} 

 getNetTot(){
  let net = this.higtPayedPrie - +this.order['auctions'][0].deposit 
  if(this.order.delivary){
    net = net + +this.order.delivary
   } 

  if(this.order.discount){
   net = +net - +this.order.discount
  } 
   return net
 }

 preparOrders(){
  let arrmax = this.order['auctions'][0].logs.sort((a, b) => (a.pay > b.pay ? -1 : 1)) 
  let arr = this.order['auctions'][0].logs.filter(x=>x.userId == this.USER_INFO._id && +x.pay == +arrmax[0].pay) 
  let winer = arr
  this.higtPayedPrie = winer[0].pay
 }


  ngOnInit() {

  }
 


  async presentModal(id?, status?) {   
    const modal = await this.modalController.create({
      component: StripePaymentPage ,
      componentProps: {
        "mzd" : this.order['auctions'][0],
        "order" : this.order,
        "status":status,
        "USER_INFO": this.USER_INFO ,
        "amount": this.getNetTot()
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
   console.log(dataReturned , dataReturned.data , dataReturned.role)
   if( dataReturned.role == 'done'){ 
    this.rout.navigate(['tabs/cart']);
   // this.mzd = dataReturned.data
   
    // this.socket.userJoiningAuction([this.USER_INFO._id,this.USER_INFO.firstName , this.mzad._id ])
    //push notification to aution's subiscribed users
  
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     user_info: JSON.stringify(this.USER_INFO),
    //     auction_id: JSON.stringify(this.mzad._id)
    //   }
    // }; 
    //  this.rout.navigate(['live-mzad'], navigationExtras); 
   } 
    
  }



 async showActionPay(){
  await this.getWalletBalance()
  await this.presentActionSheetPay()
 }



  async presentActionSheetPay() {
    const actionSheet = await this.actionSheetCtl.create({
      header: 'سداد مبلغ ',
    //  subHeader:  '  ج.س '  +  this.higtPayedPrie,  
      cssClass: 'my-custom-class',
      mode:'ios',
      buttons: [{
        text: 'رصيد المحفظة'  + this.walletBalance + " ج.س" , // add wallate balance 
      //  role: 'destructive',
        icon: 'wallet', 
        handler: () => { 
          this.performPay()
        }
      }, {
        text: 'إلغاء',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async presentActionSheetPick() {
    const actionSheet = await this.actionSheetCtl.create({
      header: 'سداد مبلغ ',
    //  subHeader:  '  ج.س '  +  this.higtPayedPrie,  
      cssClass: 'my-custom-class',
      mode:'ios',
      buttons: [{
        text: 'المحفظة', // add wallate balance 
      //  role: 'destructive',
        icon: 'wallet', 
        handler: () => {
           this.pickProduct()
        }
      },  {
        text: 'إلغاء',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
 
  validateBalance(){
    if(+this.higtPayedPrie <= this.walletBalance){ 
      return true
    }else if(+this.higtPayedPrie > this.walletBalance){ 
      return false
    }
  }


  async performPay(){
  await this.payInvoice()
  await this.backTo()
  }

  backTo(){
    this.rout.navigate(['tabs/cart']) 
  }


  payInvoice(){
      if(this.validateBalance() == false){
        this.presentToast('رصيد المحفظة غير كافي ','danger')
      } else {
        this.presentLoadingWithOptions("جاري معالجة طلبك ..") 

        let details = "سداد فاتورة رقم " + " " + this.orderId 
        let fromAccount = this.USER_INFO._id
        let toAccount = 310000205349900001 // رقم حساب الشركة
        let fromAccountTitle = "حساب محفظة : " + this.USER_INFO.firstName
        let toAccountTitle = "شركة زوودها"
        let comment = "سداد فاتورة رقم " + " " + this.orderId + "من مزاد : " + this.order.auctions[0].title +  ","  + "رقم: " +this.order.auctions[0]._id

        this.trasaction = {_id:"" , orderId:this.order._id , auctId: this.order.auctId , userId:this.USER_INFO._id ,currentStatus : 0 ,typee:1 , pay: this.higtPayedPrie ,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle}
        this.api.createTransaction(this.trasaction).subscribe(data =>{
        console.log(data)
        this.presentToast('تم سداد الفاتورة بنجاح' ,'success') 
        }, (err) => {
        console.log(err);
      },
      ()=>{
      
      }) 
      } 
    
  }


    pickProduct(){

    }

 

    async closeModal() { 
      await this.modalController.dismiss('data' );
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

}
