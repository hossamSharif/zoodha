import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule ,HttpParams} from "@angular/common/http";
import { SocketServiceService } from '../services/socket-service.service'; 
import { environment } from 'src/environments/environment';
import { Stripe, PaymentSheetEventsEnum ,ApplePayEventsEnum ,GooglePayEventsEnum ,PaymentFlowEventsEnum} from '@capacitor-community/stripe';
import { first  } from 'rxjs/operators';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as momentObj from 'moment';
 
@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.page.html',
  styleUrls: ['./stripe-payment.page.scss'],
})
export class StripePaymentPage implements OnInit { 
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
    imgUrl:any
  };
  data:any = {};
  amount:any 
  status:any
  order:any
 apis:any  ='https://coral-app-pr5y9.ondigitalocean.app/transactions/subescribestripe'
 trasaction : {_id:any,orderId:any , userId:any , auctId:any , currentStatus:0 ,typee:1 , pay:0 ,details , comment ,fromAccount:any,toAccount:any,fromAccountTitle:any,toAccountTitle:any}
  
 
 constructor(private toast:ToastController ,private loadingController:LoadingController  ,private modalCtrl: ModalController,private api:SocketServiceService , private httpClient:HttpClientModule ,private http:HttpClient) {
    
    Stripe.initialize({
      publishableKey: environment.stripe.publishableKey,
    });

   
  }

  httpPost(data){
    let params = new HttpParams() 
    params=params.append('data' , data)
   return this.http.post<any>(this.apis , data).pipe(first());
  }


  closeModel(){
    this.modalCtrl.dismiss()
  }

  ngOnInit() { 
  //console.log(this.mzd , this.USER_INFO , this.amount ,this.order,this.status)
  if(this.status == "order"){
    this.prepareOrder() 
  }else{
    this.prepareTransaction() 
  }

  this.data = {
    name:this.USER_INFO.fullName ,
    email:this.USER_INFO.email ,
    amount: this.amount,
    currency:'usd',
    transaction:this.trasaction 
  }
  //console.log('data',this.data)
  
  }

   prepareTransaction(){
    {
      let details = "سداد فاتورة إشنراك في مزاد " + " " + this.mzd['title']
      let fromAccount = this.USER_INFO._id
      let toAccount = "310000205349900001" // رقم حساب الشركة
      let fromAccountTitle = "حساب  : " + this.USER_INFO.fullName
      let toAccountTitle = "شركة زوودها"
      let comment ="سداد فاتورة إشنراك في مزاد " + " "  + "من مزاد : " + this.mzd['title'] +  ","  + "رقم: " +this.mzd['_id'] 
  
      this.trasaction = {_id:"" , orderId:"" , auctId: this.mzd['_id'] , userId:this.USER_INFO._id ,currentStatus : 0 ,typee:1 , pay: this.amount ,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle}
     }
   }

   prepareOrder(){
    {
      let details = "سداد فاتورة رقم " + " " + this.order['_id'] 
        let fromAccount = this.USER_INFO._id
        let toAccount = "310000205349900001" // رقم حساب الشركة
        let fromAccountTitle = "حساب  : " + this.USER_INFO.firstName
        let toAccountTitle = "شركة زوودها"
        let comment = "سداد فاتورة رقم " + " " + this.order['_id'] + "من مزاد : " + this.order.auctions[0].title +  ","  + "رقم: " +this.order.auctions[0]._id
  
      this.trasaction = {_id:"" , orderId:"" , auctId: this.mzd['_id'] , userId:this.USER_INFO._id ,currentStatus : 0 ,typee:1 , pay: this.amount ,details : details, comment:comment,fromAccount:fromAccount , toAccount:toAccount , fromAccountTitle:fromAccountTitle ,toAccountTitle:toAccountTitle}
     }
   }



  prepareUserbj(resubiscr?){
    if(!resubiscr){
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
    }else{
      let mzdTemp  = { 
        _id : this.mzd['_id'] ,
        user :[{
          "userId": this.USER_INFO._id, 
          "cancel": 0,
          "cancelTime":null ,
          "reason": "",
          "cancelTransId": "",
        }] 
      } 
      return mzdTemp
    }
    
   }

   prepareOrderbj(){
      let mzdTemp  = { 
        _id:this.order['_id'],
        auctId:this.mzd['_id'],
         userId: this.USER_INFO._id,
         currentStatus:1

      } 
      return mzdTemp
   }

  subescribe(){   
     this.presentLoadingWithOptions("جاري معالجة طلبك ..")
     //api to add user to log of mzad
      ////console.log('prepareUserbj',this.prepareUserbj())
      if (this.status == 'order') {
        this.api.updateOrderStatus(this.prepareOrderbj()).subscribe(data =>{
          //console.log('auction update',data ,data['updatedAuctionUsers'])
         // this.mzd['users'] = data['updatedAuctionUsers']['users']
          //console.log(this.mzd) 
          this.presentToast("تم الإشتراك بنجاح " ,'success') 
          //back to details page with new data
          this.modalCtrl.dismiss(this.mzd , 'done')
        }, (err) => { 
          this.loadingController.dismiss()
          //console.log(err.error); 
         // this.handleError(err.error.error) 
          }) 
      } else {
        this.api.updateAuctionUsers(this.prepareUserbj()).subscribe(data =>{
          //console.log('auction update',data ,data['updatedAuctionUsers'])
         // this.mzd['users'] = data['updatedAuctionUsers']['users']
          //console.log(this.mzd) 
          this.presentToast("تم الإشتراك بنجاح " ,'success') 
          //back to details page with new data
          this.modalCtrl.dismiss(this.mzd , 'done')
        }, (err) => { 
          this.loadingController.dismiss()
          //console.log(err.error); 
         // this.handleError(err.error.error) 
          }) 
      }
      
     //api to add pay transaction + 
     //
     //socket emmit to tell others + push notification 
   
   }

   crateTrans(){    
      this.api.createTrans(this.trasaction).subscribe(data =>{ 
      //console.log(data) 
      //refine transactions
      
      this.subescribe()
    }, (err) => { 
      this.loadingController.dismiss()
      //console.log(err.error);  
   })  
     
   
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
    //console.log('serv',data)
    paymentIntent = data['paymentIntent']
    ephemeralKey = data['ephemeralKey']
    customer= data['customer'] 
  }) ; 
  // prepare PaymentSheet with CreatePaymentSheetOption.
  await Stripe.createPaymentSheet({
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    merchantDisplayName:"zoodoha"
  });

 
  // present PaymentSheet and get result.
  const result = await Stripe.presentPaymentSheet();
  if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
   
    //create transaction done in the backend 

     //api to add user to log of mzad
     this.crateTrans()
    //console.log('Happy path' ,result.paymentResult )
  }
    } catch (error) {
      //console.log('err',error)
    }
  }



   

  // async applePaySheet () {
  //   try {
  //     const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
  //     if (isAvailable === undefined) {
  //       // disable to use Google Pay
  //       return;
  //     }
    
  //     // be able to get event of Apple Pay
  //     Stripe.addListener(ApplePayEventsEnum.Completed, () => {
  //       //console.log('ApplePayEventsEnum.Completed');
  //     });
      
  //     // Connect to your backend endpoint, and get paymentIntent.
  //     const data$ =  this.httpPost(this.data)
  //     //  this.http.post<{
  //     //   paymentIntent: string;
  //     //   ephemeralKey: string;
  //     //   customer: string;
  //     // }>(this.apis + 'payment-sheet', {}).pipe(first());
     
  //      let paymentIntent :any  
     
  //     const res = await data$.subscribe(data =>{
  //       paymentIntent = data['paymentIntent'] 
  //     }) ; 

  //     // const { paymentIntent } = await this.http.post<{
  //     //   paymentIntent: string;
  //     // }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);
    
  //     // Prepare Apple Pay
  //     await Stripe.createApplePay({
  //       paymentIntentClientSecret: paymentIntent,
  //       paymentSummaryItems: [{
  //         label: 'Product Name',
  //         amount: 1099.00
  //       }],
  //       merchantDisplayName: 'ksdshd',
  //       countryCode: 'US',
  //       currency: 'USD',
  //     });
    
  //     // Present Apple Pay
  //     const result = await Stripe.presentApplePay();
  //     if (result.paymentResult === ApplePayEventsEnum.Completed) {
  //       // Happy path
  //     }
   
  //   } catch (error) {
  //     //console.log('err',error)
  //   }
  // }
    // Check to be able to use Apple Pay on device
  

    async PaymentFlowSheet(){
    try{
      Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
        //console.log('PaymentFlowEventsEnum.Completed');
      });
      
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
 
  const res = await data$.subscribe(data => {
    paymentIntent = data['paymentIntent'];
    ephemeralKey = data['ephemeralKey'];
    customer= data['customer'] ;
  }) ; 
    
      // Prepare PaymentFlow with CreatePaymentFlowOption.
      Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName:"zoodoha",
        // setupIntentClientSecret: setupIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
      });
    
      // Present PaymentFlow. **Not completed yet.**
      const presentResult = await Stripe.presentPaymentFlow();
      //console.log(presentResult); // { cardNumber: "●●●● ●●●● ●●●● ****" }
    
      // Confirm PaymentFlow. Completed.
      const confirmResult = await Stripe.confirmPaymentFlow();
      if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
        // Happy path
      }
      } catch (error) {
        //console.log('err',error)
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
  

  // makePayment(token) {
  //   let info =
  //   {amount: 100,currency: "usd", token: token}
  //   this.api.makePayment(info).subscribe(data =>{
  //     //console.log('user was created',data)
  //     let res = data
  //    // //console.log('user was created',res['token'])
       
  //     // this.storage.set('token', res['token']).then((response) => {
  //     //   this.rout.navigate(['tabs/home']); 
  //     // }) 
  //   }, (err) => {
  //   //console.log(err); 
  //   // this.spinner = false
  //   // this.handleError(err.error.error) 
  // },()=>{
  //   // this.spinner = false
  // })
  // }


  // setupStripe() {
  //   let elements = this.stripe.elements();
  //   var style = {
  //     base: {
  //       color: '#32325d',
  //       lineHeight: '24px',
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSmoothing: 'antialiased',
  //       fontSize: '16px',
  //       '::placeholder': {
  //         color: '#aab7c4'
  //       }
  //     },
  //     invalid: {
  //       color: '#fa755a',
  //       iconColor: '#fa755a'
  //     }
  //   };

  //   this.card = elements.create('card', { style: style });
  //   //console.log(this.card);
  //   this.card.mount('#card-element');

  //   this.card.addEventListener('change', event => {
  //     var displayError = document.getElementById('card-errors');
  //     if (event.error) {
  //       displayError.textContent = event.error.message;
  //     } else {
  //       displayError.textContent = '';
  //     }
  //   });

  //   var form = document.getElementById('payment-form');
  //   form.addEventListener('submit', event => {
  //     event.preventDefault();
  //     //console.log(event)

  //     this.stripe.createSource(this.card).then(result => {
  //       if (result.error) {
  //         var errorElement = document.getElementById('card-errors');
  //         errorElement.textContent = result.error.message;
  //       } else {
  //         //console.log(result.source.id);
  //         this.makePayment(result.source.id);
  //       }
  //     });
  //   });
  // }

}