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

mzd : any ;  

USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
};
   
      id:any

  timeLeft :any = {da:"" ,hr:"",mn:"" ,sc:"" } 
  constructor(private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private storage: Storage ,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = JSON.parse(params.id);
        this.getAuction(this.id)
        
      }
    }); 
   }


   getAuction(id){
    this.api.getAuction(this.id).subscribe(data =>{
      console.log(data)
      let res = data['auction'][0][0]
      this.mzd = res
      console.log(this.mzd)
      this.prepare()
    }, (err) => {
    console.log(err);
  })  
  }
  
   prepare(){  
    //view time قبل دقيقتين 
     //use dateAgo pipe
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
   
    console.log(this.mzd) 
  }
  
  endAfterounter( ){ 
    let offset =  momentTz().utcOffset()
    let newDate = momentObj( this.mzd['end']).add(); 
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




  ngOnInit() {
    this.storage.get('user_info').then((response) => {
      if (response) {
        this.USER_INFO = response
        console.log(this.USER_INFO) 
      }
    });
  }


  async presentModal(id?, status?) {  
    const modal = await this.modalController.create({
      component: MzadSubescribePage ,
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
    this.presentToast("تم الإشتراك بنجاح , يمكنك المزايدة الأن" ,'success') 
    this.socket.userJoiningAuction([this.USER_INFO._id,this.USER_INFO.firstName , this.mzad._id ])

    let navigationExtras: NavigationExtras = {
      queryParams: {
        user_info: JSON.stringify(this.USER_INFO),
        auction_id: JSON.stringify(this.mzad._id)
      }
    }; 
    this.rout.navigate(['live-mzad'], navigationExtras);  
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
