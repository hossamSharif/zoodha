import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule ,HttpParams} from "@angular/common/http";
import { SocketServiceService } from '../services/socket-service.service'; 
import { environment } from 'src/environments/environment';
import { Stripe, PaymentSheetEventsEnum ,ApplePayEventsEnum ,GooglePayEventsEnum ,PaymentFlowEventsEnum} from '@capacitor-community/stripe';
import { first  } from 'rxjs/operators';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as momentObj from 'moment';
import { Storage } from '@ionic/storage';
import { error } from 'console';
@Component({
  selector: 'app-stripe-charge-wallet',
  templateUrl: './stripe-charge-wallet.page.html',
  styleUrls: ['./stripe-charge-wallet.page.scss'],
})
export class StripeChargeWalletPage implements OnInit {
  card: any;
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
  appInfoArr:Array<any> = []

 // apis:any  ='https://coral-app-pr5y9.ondigitalocean.app/transactions/subescribestripe'
  apis:any  ='http://localhost:3000/transactions'
  transaction : {_id:any,orderId:any , userId:any , auctId:any , currentStatus:0 ,typee:2 , pay:0 ,details , comment ,fromAccount:any,toAccount:any,fromAccountTitle:any,toAccountTitle:any,walletId:any,paymentMethod:any,detailsEn:any,vatFee:Number,vatOrder:Number, taxId:any}
  constructor(private alertController :AlertController,private storage: Storage,private toast:ToastController ,private loadingController:LoadingController  ,private modalCtrl: ModalController,private api:SocketServiceService , private httpClient:HttpClientModule ,private http:HttpClient) { 
    Stripe.initialize({
      publishableKey: environment.stripe.publishableKey,
    }); 
   
  }

  httpPost(data){
    let params = new HttpParams() 
    params=params.append('data' , data)
   return this.http.post<any>(this.apis , data).pipe(first());
  }

  httpPostCustomer(data){
    
    let params = new HttpParams() 
    params=params.append('data' , data)

   return this.http.post<any>(this.apis+'/createcustomerstripe' , data).pipe(first());
  }

  getAppInfo(){
    this.storage.get('APPINFO').then((response) => {
      if(response){ 
       console.log(response)
       this.appInfoArr = response.appInfo
       this.prepareTransaction()
       }else{
         
       }
     })
   }

  ngOnInit() { 
    //console.log(this.mzd , this.USER_INFO , this.amount ,this.order,this.status)
      this.getAppInfo()
      
    }

    closeModel(){
      this.modalCtrl.dismiss()
    }

    prepareTransaction(){
      {
        let details = "شحن محفظة تطبيق " + " " +this.appInfoArr[0].appName 
        let detailsEn = "Charge" + " " +this.appInfoArr[0].appName + " "+ "wallet"
        let paymentMethod = ""  //get it from stripe response 
        let taxId = this.appInfoArr[0].taxId
        let comment ="" 
        let vatFee = 0
        let vatOrder = 0
        //
        let fromAccount = ""
        let toAccount = ""  
        let fromAccountTitle = ""
        let toAccountTitle = ""  
        this.transaction = {_id:"" , orderId:"" , auctId:"" , userId:this.USER_INFO._id ,currentStatus : 0 ,typee:2 , pay: this.amount ,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle,paymentMethod:paymentMethod,detailsEn:detailsEn,walletId:this.USER_INFO.refNo,taxId:taxId,vatFee:vatFee,vatOrder:vatOrder}
       }
       console.log('pre', this.transaction)
     }

   
 
    crateTrans(payResult ){ 
      console.log('pre', this.transaction)   
       this.api.createTransChargeWallet(this.transaction).subscribe(data =>{ 
      console.log(data) 
       //refine transactions
       this.modalCtrl.dismiss([data,payResult] , 'done' )
     }, (err) => { 
       this.loadingController.dismiss()
       console.log(err)  
       //handel error in save transaction by show alert and recall save again
       console.log(err.error);  
       this.handelTransSaveError()
    })   
    }



    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'حدث خطأ اثناء ما ',
        subHeader:'حدث خطأ اثناء ما ' ,
        backdropDismiss:false,
        message:'لم تتم حفظ معاملتك المالية لدينا , إضغط علي موافق لإعادة المحاولة ',
        buttons: [   
        {
          text: 'موافق',
          role: 'ok',
          handler: (alertData) => { //takes the data 
            this.crateTrans('success')
          }
        } ] 
      }); 
      await alert.present();
      // alert.onDidDismiss().then((dataReturned) => {
      //   if (dataReturned !== null) {
      //     console.log('alert',dataReturned )
      //     this.doAfterDismissAlert(dataReturned.role , dataReturned.data.values.amount )
      //   }
      // });
    }

      handelTransSaveError(){
        this.presentAlert()
      }

  async createCustomerStripe() {
    try {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
       console.log('PaymentSheetEventsEnum.Completed');
      });

     let custdata={
      email:this.USER_INFO.email ,
      name:this.USER_INFO.userName,
      id:this.USER_INFO.refNo,
      phone:this.USER_INFO.phone
    } 
      // Connect to your backend endpoint, and get every key.
      const data$ = this.httpPostCustomer(custdata)


      //let paymentIntent :any 
      let ephemeralKey: any
      let customer: any

      const res = await data$.subscribe(data => {
        ephemeralKey = data['ephemeralKey']
        customer = data['customer']
        console.log('res f customer', res)
      }, (error) => {
        console.log('error', error)
      }
      );
    } catch (error) {
      console.log('err', error)
      this.presentToast('somthing Went wrong', 'danger')
    }
  }




    async paymentSheet(){
      try {
         // be able to get event of PaymentSheet
       Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
       //console.log('PaymentSheetEventsEnum.Completed');
       });
    
    // const data = new HttpParams({
    //   fromObject:this.data
    // })
  
    // Connect to your backend endpoint, and get every key.
     const data$ =  this.httpPost(this.data)
    //  this.http.post<{
    //   paymentIntent: string;
    //   ephemeralKey: string;
    //   customer: string;
    // }>(this.apis + 'payment-sheet', {}).pipe(first());
   
     let paymentIntent :any 
     let ephemeralKey:any 
     let  customer  :any
   
    const res = await data$.subscribe(data =>{
     
      paymentIntent = data['paymentIntent']
      ephemeralKey = data['ephemeralKey']
      customer= data['customer'] 
    },(error)=>{
      console.log('error' ,error) 
    }
    ); 

    // prepare PaymentSheet with CreatePaymentSheetOption.
    await Stripe.createPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      merchantDisplayName:this.appInfoArr[0].appName
    });
  
   
    // present PaymentSheet and get result.
    const result = await Stripe.presentPaymentSheet();
    if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
       this.crateTrans(result.paymentResult)
       console.log('Happy path' ,result.paymentResult,result)
     }
      } catch (error) {
        console.log('err',error)
        this.presentToast('somthing Went wrong' ,'danger')
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
