import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocketServiceService } from '../services/socket-service.service';
import { StripePaymentPage } from '../stripe-payment/stripe-payment.page';
import { StripeChargeWalletPage } from '../stripe-charge-wallet/stripe-charge-wallet.page';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  errorLoadBalance:boolean = false
  zeroBalance:boolean = false
  errorLoad:boolean = false
  balanceLoding :boolean = false
  USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
    };
    showEmpty : boolean = false
    showSkelton :boolean = false
    transactions:Array<any> = undefined
    walletBalance:any = undefined


    constructor(private alertController :AlertController,private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) { 
      this.storage.get('user_info').then((response) => {
        if (response) {
          this.USER_INFO = response.user
          console.log('kkkkkkkkkk',this.USER_INFO) 
           this.getWalletBalance()
        }
       });
     }


    getWalletBalance(){ 
        this.api.getBalance(this.USER_INFO._id).subscribe(data =>{
          console.log('balance',data)
          
          if(data['transaction'].length == 0)
          {
            this.zeroBalance = true
            this.walletBalance = 0
            this.transactions = []
          }else{
            let res = data['transaction'][0]
            this.walletBalance = +res.balance
            this.getTransactions()
          } 
        }, (err) => {
        //console.log(err);
        this.errorLoad = true
      } ,
      ()=>{ 
      })  
    }
    
    getTransactions(){ 
      this.api.getAllTransaction(this.USER_INFO._id).subscribe(data =>{
        console.log('all trans',data)
        let res = data['transaction'] 
        this.transactions = res 
      }, (err) => {
      //console.log(err);
      this.errorLoad = true

    } ,
    ()=>{ 
    })  
  } 



  getWalletBalanceAfterCharge(){ 
        this.balanceLoding = true
        this.api.getBalance(this.USER_INFO._id).subscribe(data =>{
          //console.log(data)
          let res = data['transaction'][0]
          this.walletBalance = +res.balance
          this.balanceLoding = false
          this.getTransactions()
        }, (err) => {
        //console.log(err);
        this.errorLoad = true
        this.balanceLoding = false
      } ,
      ()=>{ 
      })  
    }

  reload(){
    this.errorLoad = false
    this.errorLoadBalance = false
    this.transactions = undefined
    this.walletBalance = undefined
    this.getWalletBalance()
    }

     

  ngOnInit() {

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
    //console.log('Loading dismissed with role:', role);
  }


 

 
  async presentModal(amount?) {   
    const modal = await this.modalController.create({
      component: StripeChargeWalletPage ,
      componentProps: { 
        "USER_INFO": this.USER_INFO,
        "amount":amount,
        "description":this.transactions,
        "descriptionEn":this.transactions
      }
     });
    
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //console.log(dataReturned )
        this.doAfterDissmiss(dataReturned)
      }
    }); 
    return await modal.present(); 
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'الرجاء إدخال المبلغ',
      buttons: [ {
        text: 'إلغاء',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
            console.log('Confirm Cancel');
        }
    }, 
    {
        text: 'موافق',
        role: 'ok',
        handler: (alertData) => { //takes the data 
            console.log(alertData.amount);
        }
    }
  ],
      inputs: [ 
        {
          name: 'amount',
          type: 'number',
          placeholder: 'ادخل المبلغ هنا',
          min: 1,
          max: 6,
        } 
      ],
    }); 
    await alert.present();
    alert.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('alert',dataReturned )
        this.doAfterDismissAlert(dataReturned.role , dataReturned.data.values.amount )
      }
    });
  }
 
doAfterDismissAlert(role , amount){
  if( role == 'ok'){
    this.presentModal(amount)
   }else if(role == 'cancel'){
    
   }else {
    this.presentToast('somthing went wron', 'danger')
    console.log('dismiss')
   } 
}


doAfterDissmiss(dataReturned){
  //console.log(dataReturned , dataReturned.data , dataReturned.role)
  if(dataReturned.role == 'done'){ 
    this.getWalletBalanceAfterCharge() 
  }  
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

handleError(err){
   this.presentToast('حدث خطأ ما الرجاء المحاولة مرة اخري','danger') 
 }



}
