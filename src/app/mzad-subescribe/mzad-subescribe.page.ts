import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { SocketServiceService } from '../services/socket-service.service';
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
@Component({
  selector: 'app-mzad-subescribe',
  templateUrl: './mzad-subescribe.page.html',
  styleUrls: ['./mzad-subescribe.page.scss'],
})
export class MzadSubescribePage implements OnInit {
agreeTerms:boolean = false
walletBalance : any 
mzd : any ;   
USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
};
  constructor(private api:SocketServiceService,private rout : Router,private loadingController:LoadingController , private toast:ToastController,private actionSheetCtl:ActionSheetController ,private modalController:ModalController) {


   }

  ngOnInit() {
    console.log(this.mzd , this.USER_INFO)
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
  
  async closeModal() { 
    this.modalController.dismiss()
      await this.modalController.dismiss(this.mzd , 'cancel');
    }

  agreeCheck(ev){
    console.log(ev.target.value)
    console.log(this.agreeTerms)
   } 


    validate(){
      if(this.agreeTerms == false){
        this.presentToast('الرجاء قراءة الشروط والإتفاقية والموافقة عليها','danger')
        return false
       } else if (this.walletBalance < +this.mzd['deposite'] + +this.mzd['fee'] ){
        this.presentToast('رصيدك غير كافي , الرجاء شحن محفظتك','danger')
        return false
        }else if(this.checkRemainTime() <= 60000){
        console.log('this.checkRemainTime()',this.checkRemainTime())
        this.presentToast('لا يمكنك الإشتراك , لقد بدأ المزاد بالفعل','danger')
        return false
        } else{ 
        return true
      }   
        // validate if user not restircted
        // validate if user not from staff
         
    }

    // wallet pehavior subject must change when user add balance to his wallet from anotherapp

checkRemainTime(){
  //offset between now and startdate auction
    let newDate = momentObj(this.mzd['start']); 
    let today = new Date() 
    return momentObj(newDate).diff(momentObj(today));
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

 
 subescribe(){  
  if(this.validate() == true){
    this.presentLoadingWithOptions("جاري معالجة طلبك ..")
   //api to add user to log of mzad
    console.log('prepareUserbj',this.prepareUserbj())
    this.api.updateAuctionUsers(this.prepareUserbj()).subscribe(data =>{
    console.log('auction update',data ,data['updatedAuctionUsers'])
    this.mzd['users'] = data['updatedAuctionUsers']['users']
    console.log(this.mzd) 
    this.presentToast("تم الإشتراك بنجاح " ,'success') 
    //back to details page with new data
    this.modalController.dismiss(this.mzd , 'done')
  }, (err) => { 
    this.loadingController.dismiss()
    console.log(err.error); 
    this.handleError(err.error.error) 
 },()=>{
  this.loadingController.dismiss()
 }
 )  
   //api to add pay transaction + 
   //
   //socket emmit to tell others + push notification 
  }
  
   
}

reSubiscribtion(){
  // when user cancel subiscribe to auctions 
  // user can only cancel subiscrbe befor auction start date(){ 
  if(this.validate() == true){
    this.presentLoadingWithOptions("جاري معالجة طلبك ..")
   //api to add user to log of mzad
    console.log('prepareUserbj',this.prepareUserbj('resubiscr'))
    this.api.resubiscribeAuctionUsers(this.prepareUserbj('resubiscr')).subscribe(data =>{
    console.log('auction update',data ,data['updatedAuctionUsers'])
    
    this.presentToast("تم الإشتراك بنجاح " ,'success') 
    this.modalController.dismiss(this.mzd , 'done')
    this.rout.navigate(['tabs/home']);
  }, (err) => { 
    this.loadingController.dismiss()
    console.log(err.error); 
    this.handleError(err.error.error) 
 },()=>{
  this.loadingController.dismiss()
 }
 )  
   //api to add pay transaction + 
   //
   //socket emmit to tell others + push notification 
  }
   
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




  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtl.create({
      header: 'دفع رسوم الإشتراك ',
      subHeader: this.mzd.fee + this.mzd.deposit + 'ج.س',
      cssClass: 'my-custom-class',
      mode:'ios',
      buttons: [{
        text: 'المحفظة',
        // role: 'destructive',
        icon: 'wallet',
        // data: {
        //   type: 'delete'
        // },
        
        handler: () => {
          if(this.mzd.userOut == true){
            this.reSubiscribtion();
          }else{
             this.subescribe();
          }
          
        }
      }
      // , {
      //   text: 'قوقل باي',
      //   icon: 'logo-google',
      //   data: 10,
      //   handler: () => {
      //     this.subescribe();

      //   }
      // }, {
      //   text: 'ابل باي',
      //   icon: 'logo-apple',
      //   data: 'Data value',
      //   handler: () => {
      //     this.subescribe();

      //   }
      // }
        ,{
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


