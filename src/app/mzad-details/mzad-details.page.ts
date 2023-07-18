import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable,Observer, timer } from 'rxjs';
import { MzadSubescribePage } from '../mzad-subescribe/mzad-subescribe.page';
import { Storage } from '@ionic/storage';
import { SocketServiceService } from '../services/socket-service.service';
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
@Component({
  selector: 'app-mzad-details',
  templateUrl: './mzad-details.page.html',
  styleUrls: ['./mzad-details.page.scss'],
})
export class MzadDetailsPage implements OnInit {
  style : any = 'style2'
  mzad = { 
    "_id": "06e6f08e85e942d290ec642c14614637",
    "title": "iphone pro",
    "shortDescr": "iuhiuygi",
    "descr": "vhghvi87797",
    "imgs": [
      "jhohih"
    ],
    "start": {
      "$date": {
        "$numberLong": "1668202503976"
      }
    },
    "end": {
      "$date": {
        "$numberLong": "1668202503976"
      }
    },
    "currentStatus": 1,
    "fee": 0,
    "deposit": 0,
    "productPrice": 0,
    "minUsercount": 90,
    "contryCode": "249",
    "terms": [],
    "users": [
      {
        "userId":  "736fc6299c3a4269ace43b7641014af2",
        "status": 1,  
        "userName": "boorak", 
      },
      {
        "userId":  "700865bcaa934e5ebe956a2013c33395",
        "status": 1,  
        "userName": "hossam", 
      }
    ],
    "logs": [
      // {
      //   "userId": String ,
      //   "time": Date,
      //   "pay" : Number,
      //   "lastHighestPay": Number , //to confirm last payment that happend pefore this one
      //   }
    ],
    "createdAt": {
      "$date": {
        "$numberLong": "1668202503993"
      }
    },
    "updatedAt": {
      "$date": {
        "$numberLong": "1668202503993"
      }
    },
    "__v": 0
  
}
errorLoad:boolean = false
showMore:boolean = false
view:number ;
mzd : any  = undefined;   
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
   
  id:any 
  terms: Array<any>=[];
  timeLeft :any = {da:"" ,hr:"",mn:"" ,sc:"" } 
  constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) {
   
   }

   tirmString(string ,length){
    return  string.substring(0, length) + '...'  ;
   }

 
   ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = JSON.parse(params.id);
        this.storage.get('user_info').then((response) => {
          if (response) {
            this.USER_INFO = response.user
            console.log(this.USER_INFO) 
            this.getAuction(this.id) 
          }
        });
       
      }
    }); 
  }

 
  reload(){
    this.errorLoad = false
    this.mzd = undefined
    this.getAuction(this.id)
    }

   getAuction(id){
    this.api.getAuction(this.id).subscribe(data =>{
      console.log(data)
      let res = data['auction']
      this.mzd = res
      console.log('mzzzz',this.mzd)
      this.prepare()
    }, (err) => {
      this.errorLoad = true
    console.log(err);
  })  
  }

   prepare(){   
     this.timeLeft = this.endAfterounter()  
     if(this.mzd['currentStatus'] == 1 ){
      this.mzd['timeLeft'] = this.startAfterounter( ) 
    }else if (this.mzd['currentStatus'] == 2){
      //edit here
      this.mzd['timeLeft'] = this.endAfterounter( )

    } else if (this.mzd['currentStatus'] == 3){
      //edit here
      this.mzd['timeLeft'] = this.endSinceAfterounter( )

    }  


     // userIn
     let fltuse:Array<any> =[]
     fltuse = this.mzd.users.filter(x=>x.userId ==  this.USER_INFO._id)
     console.log('fltuse' , fltuse )

    if(fltuse.length> 0 && this.mzd.currentStatus < 3 && fltuse[0].cancel == 0){
      this.mzd.userIn = true 
     }else if(fltuse.length> 0 && fltuse[0].cancel == 1){
      this.mzd.userOut = true 
     }
     else if(this.mzd.logs.length > 0 && fltuse.length> 0 && this.mzd.currentStatus == 3){
      // userWin
      let mx =  this.mzd.logs.reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0); 
      let flt = this.mzd.logs.filter(x=>x.pay == mx)
      console.log('userWin', mx , flt )
      if(flt[0].userId == this.USER_INFO._id){
        this.mzd.userWin = true
      }
     }


     let du = momentObj.duration(momentObj(this.mzd['end']).diff(momentObj(this.mzd['start']))); 
     let hr = ""
     let day = "" 
     let con = ""
     if(du.days() > 0){
       day = du.days().toString() + " يوم"  
     } 
     if(du.hours() > 0){
       hr =  du.hours().toString() + " ساعة"  
     }
     if(du.hours() > 0 && du.hours() > 0){
       con = " , " 
     }
     this.mzd['duration'] = day + con + hr 
     console.log('length',this.mzd['terms'].length)
     if(this.mzd['terms'].length > 3){
      this.getTerms('less')
    }else{
      this.getTerms('more')
    }
    console.log(this.mzd) 
  }
  



  viewMoreLess(){
    console.log(this.view)
    if(this.view == 0){
      this.getTerms('more')
      this.view = 1
    } else {
      this.getTerms('less')
      this.view = 0
    }
  }

  getTerms(moreOrLess?){
    let length
    if(moreOrLess == 'less'){
      length = 3
    }else if(moreOrLess == 'more'){
      length = this.mzd['terms'].length
    } else{
      length = this.mzd['terms'].length 
    }  
    this.terms = []
    for (let index = 0; index < length; index++) {
      const element = this.mzd['terms'][index];
      this.terms.push(element)  
    } 
    this.view = 0    
  }


  endAfterounter(){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj(this.mzd['end']).add(); 
     console.log('init', this.mzd['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
    return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memntoEnd(newDate).asDays().toFixed(0).toString(),hr: this.memntoEnd(newDate).hours().toString() ,mn:this.memntoEnd(newDate).minutes().toString(),sc:this.memntoEnd(newDate).seconds().toString()}
        ), 1000);
    });
  }

  memntoEnd(newDate){  
    return momentObj.duration(momentObj(newDate).diff(momentObj()));
  }


  startAfterounter( ){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj( this.mzd['start']).add(); 
     console.log(momentObj(),'init', this.mzd['start'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
     return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memntoStart(newDate).asDays().toFixed(0).toString(),hr: this.memntoStart(newDate).hours().toString() ,mn:this.memntoStart(newDate).minutes().toString(),sc:this.memntoStart(newDate).seconds().toString()}
        ), 1000);
    });
  }


  memntoStart(newDate){  
    let today = new Date() 
    return momentObj.duration(momentObj(newDate).diff(momentObj(today)));
  }



  endSinceAfterounter( ){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj( this.mzd['end']).add(); 
     console.log(momentObj(),'init', this.mzd['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
     return new Observable<object>((observer: Observer<object>) => {
      setInterval(() => observer.next(
        {da:this.memnSinceEnd(newDate).asDays().toFixed(0).toString(),hr: this.memnSinceEnd(newDate).hours().toString() ,mn:this.memnSinceEnd(newDate).minutes().toString(),sc:this.memnSinceEnd(newDate).seconds().toString()}
        ), 1000);
    });
  }

  memnSinceEnd(newDate){  
    return momentObj.duration(momentObj().diff(momentObj(newDate)));
  }




 

  async presentModal(id?, status?) {  
    const modal = await this.modalController.create({
      component: MzadSubescribePage ,
      componentProps: {
        "mzd" : this.mzd ,
        "USER_INFO": this.USER_INFO
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
      this.rout.navigate(['tabs/home']);
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

   checkRemainTime(){
    //offset between now and startdate auction
      let newDate = momentObj(this.mzd['start']); 
      let today = new Date() 
      return momentObj(newDate).diff(momentObj(today));
  }

   validate(){
     if(this.checkRemainTime() <= 60000){
      console.log('this.checkRemainTime()',this.checkRemainTime())
      this.presentToast('لا يمكنك الإشتراك , لقد بدأ المزاد بالفعل','danger')
      return false
      } else{ 
      return true
    }   
      // validate if user not restircted
      // validate if user not from staff
       
  }

   prepareUserbj(){
    let mzdTemp  = { 
      _id : this.mzd['_id'] ,
      user :[{
        "userId": this.USER_INFO._id, 
        "cancel": 1,
        "cancelTime":new Date() ,
        "reason": "i dont Know",
        "cancelTransId": "",
      }] 
    } 
    return mzdTemp
   }

   cancelSubiscribtion(){
    // when user cancel subiscribe to auctions 
    // user can only cancel subiscrbe befor auction start date(){ 
    if(this.validate() == true){
      this.presentLoadingWithOptions("جاري معالجة طلبك ..")
     //api to add user to log of mzad
      console.log('prepareUserbj',this.prepareUserbj())
      this.api.cancelAuctionUsers(this.prepareUserbj()).subscribe(data =>{
      console.log('auction update',data ,data['updatedAuctionUsers'])
    
      this.presentToast("تم إلغاء الإشتراك بنجاح " ,'success') 
      //back to home page with new data
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
    let navigationExtras: NavigationExtras = {
      queryParams: {
        mzd: JSON.stringify(this.mzd),
        user_info: JSON.stringify( this.USER_INFO), 
      }
    };
    this.rout.navigate(['mzad-subescribe'], navigationExtras);
    // this.presentModal()
   }
}
