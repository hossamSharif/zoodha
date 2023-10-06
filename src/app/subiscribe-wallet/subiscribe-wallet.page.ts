import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule ,HttpParams} from "@angular/common/http";
import { SocketServiceService } from '../services/socket-service.service'; 
import { environment } from 'src/environments/environment';
import { Stripe, PaymentSheetEventsEnum ,ApplePayEventsEnum ,GooglePayEventsEnum ,PaymentFlowEventsEnum} from '@capacitor-community/stripe';
import { first  } from 'rxjs/operators';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as momentObj from 'moment';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-subiscribe-wallet',
  templateUrl: './subiscribe-wallet.page.html',
  styleUrls: ['./subiscribe-wallet.page.scss'],
})
export class SubiscribeWalletPage implements OnInit {
  mzd : any ;   
  USER_INFO : {
    _id:any,
    firstName:any, 
    lastName:any, 
    fullName:any,
    type:any, 
    phone :any,
    contryCode :any,
    password:any,
    gender:any,
    email:any,
    userName:any,
    imei:any,
    birthDate:any,
    logMethod:any
    imgUrl:any,
    refNo:any
  };
  data:any = {};
  amount:any  
  status:any 
  walletBalance
  appInfoArr:Array<any> = []
  transaction : {_id:any,orderId:any , userId:any , auctId:any , currentStatus:0 ,typee:1 , pay:0 ,details , comment ,fromAccount:any,toAccount:any,fromAccountTitle:any,toAccountTitle:any,paymentMethod:any,detailsEn:any,vatFee:any,vatOrder:any, taxId:any} 

 constructor(private storage: Storage,private modalController:ModalController, private toast:ToastController ,private loadingController:LoadingController  ,private modalCtrl: ModalController,private api:SocketServiceService , private httpClient:HttpClientModule ,private http:HttpClient) { 
   
}

  ngOnInit() {
    console.log(this.amount , this.walletBalance)
    this.getAppInfo()
    this.prepareTransaction() 
  }

  getAppInfo(){
   this.storage.get('APPINFO').then((response) => {
     if(response){ 
      console.log(response)
      this.appInfoArr = response
      }else{
        
      }
    })
  }

  closeModel(){
    this.modalCtrl.dismiss()
  }

  prepareTransaction(){
    {
      let details = "سداد رسوم إشتراك في مزاد" + " " + this.mzd['titleEn']
      let detailsEn = "pay auction's subescribtion fees " + " " +this.mzd['titleEn'] 
      let paymentMethod = "محفظة تطبيق " + " " +this.appInfoArr['appName'] 
      let taxId = this.appInfoArr[0].taxId 
      let vatFee = this.mzd['vatFee']
      let vatOrder = this.mzd['vatOrder']
      let pay = this.amount + (this.amount *  (+this.mzd['vatFee']/100 ))
      //
      let comment ="" 
      let fromAccount = ""
      let toAccount = ""  
      let fromAccountTitle =""
      let toAccountTitle = ""
 
 
      this.transaction = {_id:"" , orderId:"" , auctId: this.mzd['_id'], userId:this.USER_INFO._id ,currentStatus : 0 ,typee:1 , pay: pay,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle,paymentMethod:paymentMethod,detailsEn:detailsEn,taxId:taxId,vatFee:vatFee,vatOrder:vatOrder}
     
    //  this.transaction = {_id:"" , orderId:"" , auctId:this.mzd['_id'] , userId:this.USER_INFO._id ,currentStatus : 0 ,typee:1 , pay: this.amount ,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle,vatFee:"",vatOrder:""}
     }
     console.log('pre', this.transaction)
   }

  

  prepareUserbj(resubiscr?){
      let mzdTemp  = { 
        _id : this.mzd['_id'] ,
        user :[{
          "userId": this.USER_INFO._id,
          "status": 1,
          "time":  new Date() ,
          "cancel": 0,
          "cancelTime": "",
          "reason": "",
          "transactionId": "",
        }] 
      } 
      return mzdTemp 
   }

   crateTrans(){ 
    this.presentLoadingWithOptions("جاري معالجة طلبك ..")
    console.log('pre', this.transaction)   
     this.api.createTrans(this.transaction).subscribe(data =>{ 
     console.log(data) 
     this.subescribe()
      }, (err) => { 
    this.handleError(err)
     this.loadingController.dismiss()
     console.log(err)  
     //console.log(err.error);  
  })   
  }
 
  subescribe(){   
     //api to add user to log of mzad
      //console.log('prepareUserbj',this.prepareUserbj())
      this.api.updateAuctionUsers(this.prepareUserbj()).subscribe(data =>{
      //console.log('auction update',data ,data['updatedAuctionUsers'])
      this.mzd['users'] = data['updatedAuctionUsers']['users']
      //console.log(this.mzd) 
      this.loadingController.dismiss()
      this.presentToast("تم الإشتراك بنجاح " ,'success') 
      //back to details page with new data
      this.modalController.dismiss(this.mzd , 'done')
    }, (err) => {  
      //console.log(err.error); 
      this.handleError(err.error.error) 
   },()=>{
    this.loadingController.dismiss()
    }
    ) //socket emmit to tell others + push notification 
       
    }


    handleError(err){
      if(err == 'max users'){
       this.presentToast('اكتمل العدد المطلوب , لا يمكنك المشاركة','danger')
      }else if(err == 'prev cancel trans not done'){
       this.presentToast('لديك عملية إرجاع مبلغ لم تكتمل , لا يمكنك المشاركة','danger')
      }else{
       this.presentToast('حدث خطأ ما الرجاء المحاولة مرة اخري','danger') 
      }
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
