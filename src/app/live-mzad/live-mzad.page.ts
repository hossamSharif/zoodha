import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Observer, timer } from 'rxjs'; 
import { map, take } from "rxjs/operators";
import { MzadSubescribePage } from '../mzad-subescribe/mzad-subescribe.page';
import { SocketServiceService } from '../services/socket-service.service';
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
 
@Component({
  selector: 'app-live-mzad',
  templateUrl: './live-mzad.page.html',
  styleUrls: ['./live-mzad.page.scss'],
})
export class LiveMzadPage implements OnInit { 
    showMore:boolean = false
    emptyLog :boolean =false
    USER_INFO : {
    _id: any ,
    firstName: any,
    lastName :any
    };
    errorLoad:boolean = false
    roundsMode:any = true
    availRounds = 0
     auction_id :any ;
     highestBidd:any = 0
     lastBidd4U:any = 0
      timeLeft :any = {da:"" ,hr:"",mn:"" ,sc:"" } 
      bidPrice:any;
      showMe:boolean = false;
      mzd : any ;
      users : Array<any>=[];
      usersLogs : Array<any>=[];
      termsArr : Array<any>=[];
      view:number ;
      viewTerms:number ;
      showError:boolean = false
      msgError:string =""
      
      //time$ = timer(0, 1000).pipe(map(() => new Date()));
constructor(private alertController :AlertController,private api:SocketServiceService,private socket :SocketServiceService ,private route: ActivatedRoute,private loadingController:LoadingController,private toast:ToastController,private actionSheetCtl:ActionSheetController ,private datePipe:DatePipe ,private rout : Router,private modalController:ModalController) {  
  this.route.queryParams.subscribe(params => {
          console.log('params',params)
          if (params && params.id) {
            this.USER_INFO = JSON.parse(params.user_info);
            this.auction_id = JSON.parse(params.id) 
            console.log( this.auction_id)
            this.getAuction()
          }
        });  
      }

      tirmString(string ,length){
        return  string.substring(0, length) + '...'  ;
       }



  ngOnInit() { 
    //notify other when some how join live stream 
    this.socket.userJoinedAuction().subscribe((UserHadJoined: Array<any>) => { 
         console.log(UserHadJoined)
         if(UserHadJoined.length>0){
          this.presentToast(UserHadJoined[1] +"  إنضم" ,'success')
          //change user status from offline to online 
         }
    }) 

    //notify other when some how add bidding (listing)
    this.socket.userBiddedInAuction().subscribe((logArr: Array<any>) => { 
        
         if(logArr.length>0){
          console.log('jahsja',logArr)
          this.mzd['logs'].push(logArr[0][0]) 
          this.prepareAuc() 
          this.presentToast(logArr[1].firstName + " " + logArr[0][0].pay ,'success')
         
         }
    }) //notify other when some how fucos input and start writting bid price (listing)


    this.socket.userFucosedBiddedInAuction().subscribe((logArr: Array<any>) => { 
         console.log(logArr)
         if(logArr.length>0){
        // this.presentToast(logArr[0].firstName  ,'success') 
         }
    })
  //notify other when some how fucos input and start writting bid price (listing)

     this.socket.userFucosedLostBiddedInAuction().subscribe((logArr: Array<any>) => { 
      console.log(logArr)
      if(logArr.length>0){
     // this.presentToast(logArr[0].firstName  ,'danger') 
      }
 })
 
 
}

ionViewDidEnter(){
  ////  
  this.socket.auctionEndOntime().subscribe((ar: Array<any>) => { 
  console.log('here im',ar)
  this.presentToast('holla  auction end on time ' ,'success') 
  if(ar.length>0){
    //this.presentToast('holla  auction end on time ' ,'success')
    this.onEndAuction(ar[1],ar[2]) 
  }
})
}
 

reload(){
this.errorLoad = false
this.mzd = undefined
this.getAuction()
}

handleError(err){ 
  this.errorLoad = true
  // if (err.error == "No user with this phone found") {
  //   console.log('no user was found') 
  // // this.getsms('new',err) // uncomment it after apply smsgetway 
  // // this.getVirfyCode('new' , err) // comment it after apply smsgetway 
  // }else if(err.error == "another phone"){
  //   // to apply imei check uncmment the line in zoodohapi/controller/user.j function : loginPhone
  //   this.presentToast('seem you use another phone','danger') 
  // } else{ 
  //   this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
  //   console.log(err.kind)
  // }
}
getAuction(){ 
    this.api.getAuction(this.auction_id).subscribe(data =>{
      console.log(data)
      let res = data['auction'][0][0]
      this.mzd = data['auction'][0][0]
      this.users = data['auction'][1]
      console.log('im here baby',this.mzd , 'users',this.users)
     this.prepareAuc()
    }, (err) => {
    this.handleError(err.error.error)
    console.log(err);
  })  
 } 

prepareAuc(){
    this.timeLeft = this.endAfterounter() 
    //ordering log depend on date desc
    // this.mzd['logs']=this.mzd['logs'].sort((x, y) => +new Date(x.time) > +new Date(y.time));
   if( this.mzd['logs'].length>0 ){  
    this.emptyLog = false
    this.mzd['logs']=  this.mzd['logs'].sort(function (a, b) {
      var dateA = new Date(a.time);
      var dateB = new Date(b.time);
      return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
    });
    console.log('sorting',  this.mzd['logs']) 
    //view time قبل دقيقتين 
     //use dateAgo pipe
    
     //get heigt price
    this.highestBidd =  this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
    console.log('highestBidd',this.highestBidd)
    //  last bidd for you
    let flt :Array<any> = []  
     flt = this.mzd['logs'].filter(x=>x._id == this.USER_INFO._id)
    if(flt.length > 0){
      this.lastBidd4U =  flt[0].pay
      console.log('pay' , this.lastBidd4U)
    }else{
      this.lastBidd4U = 0
    }
     
    // prepare users Log
    console.log('prepare users Log',this.mzd['logs'].length)
    if(this.mzd['logs'].length > 2){
      console.log('less')
      this.getUserinfoLog('less')
    }else{
      console.log('more') 
      this.getUserinfoLog('more')
    }

 
  }else{
    this.emptyLog = true
  }
  
     // prepare terms 
     if(this.mzd['terms'].length >2){
      this.getTerms('less')
    }else{
      this.getTerms('more')
    } 


    // rounds preabare
   this.availRounds = this.mzd['rounds']
   let flt : Array<any> = []
   if(this.mzd['logs'].length>0){
    flt =  this.mzd['logs'].filter(x=>x.userId == this.USER_INFO._id) 
    this.availRounds = this.mzd['rounds'] - +flt.length
    console.log('rounds preabare' , this.mzd['rounds'] , flt.length)
    console.log('rounds preabare' , this.usersLogs )
   } 
  

  
} 

onEndAuction(winnerId , orderId){
  if(winnerId == this.USER_INFO._id){
    this.presentAlert('winner' ,winnerId , orderId)
  }else{
    this.presentAlert()
  } 
}

async presentAlert(stat? ,winId? ,orderId?) {
  let msg :any = ""
  let subHeader :any = ""
  let header :any = ""
  let btns :Array<any> = []

  if(stat == 'winner'){
    subHeader = 'مبروووك '
    msg = 'لقد ربحت المزاد , اضغط علي متابعة الطلب '
    btns = [
      {
        text: 'متابعة الطلب',
        role: 'orders',
        handler: () => {
           this.goToOrderDetails(orderId)
        },
      }
    ]
  }else{
    subHeader = 'لم تربح المزاد  '
    msg = 'حظا موفقا في المرة القادمة'
    btns = [
      {
        text: 'الرئيسية',
        role: 'home',
        handler: () => {
           this.goHome()
        },
      }
    ]
  }
  const alert = await this.alertController.create({
    header: 'تنبيه',
    subHeader:subHeader ,
    message:msg,
    mode:'ios',
    buttons: btns,
    backdropDismiss:false
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();
 //  this.roleMessage = `Dismissed with role: ${role}`;
}


goToOrderDetails(orederId){
  let navigationExtras: NavigationExtras = {
    queryParams: { 
      id: JSON.stringify(orederId),
      user_info: JSON.stringify(this.USER_INFO )
    }
  };
  this.alertController.dismiss()
  this.rout.navigate(['order-details'] , navigationExtras);
}

goHome(){
  this.rout.navigate(['tabs/home']);  
}

getUserinfoLog(moreOrLess?){ 
  let length
  if(moreOrLess == 'less'){
    length = 2
    this.view = 0
  }else if(moreOrLess == 'more'){
    length = this.mzd['logs'].length
    this.view = 1
  } else{
    length = this.mzd['logs'].length 
    this.view = 3
  }
  console.log('length', length)
  this.usersLogs = []
 
  for (let index = 0; index < length; index++) {
    const element = this.mzd['logs'][index];
    console.log('element', element) 
    let flt : Array<any> = [] 
    flt =  this.users.filter(x=>x._id == element.userId) 
    if(flt.length>0){
      this.usersLogs.push({
        "userId": element.userId ,
        "time":  element.time,
        "pay" : +element.pay,
        "lastHighestPay": +element.lastHighestPay,
        "userName" : flt[0]['userName'] 
     })
    } 
  } 

  
  



 // this.view = 0  
  // this.mzd['logs'].forEach(element => {
  //    let flt =  this.users.filter(x=>x._id == element.userId)[0].userName
  //    this.usersLogs.push({
  //       "userId": element.userId ,
  //       "time":  element.time,
  //       "pay" : +element.pay,
  //       "lastHighestPay": +element.lastHighestPay,
  //       "userName" : flt 
  //    })
  // }); 
} 

getTerms(moreOrLess?){ 
  let length
  if(moreOrLess == 'less'){
    length = 2
    this.viewTerms = 0
  }else if(moreOrLess == 'more'){
    length = this.mzd['terms'].length
    this.viewTerms = 1 
  } else{
    length = this.mzd['terms'].length 
    this.viewTerms = 3 
  }
  
  this.termsArr = []
  
  for (let index = 0; index < length; index++) {
    const element = this.mzd['terms'][index];
    console.log('element', element)  
      this.termsArr.push(element) 
  } 

}

viewMoreLess(){
  console.log(this.view)
  if(this.view == 0){
    this.getUserinfoLog('more')
    this.view = 1
  } else {
    this.getUserinfoLog('less')
    this.view = 0
  }
}

viewMoreLessTerms(){
  console.log(this.view)
  if(this.viewTerms == 0){
    this.getTerms('more')
    this.viewTerms = 1
  } else {
    this.getTerms('less')
    this.viewTerms = 0
  }
}

startAfterounter(startDate){ 
  setInterval(function() {
    const timeLeft =  momentObj.duration(momentObj(startDate).diff(momentObj())); // get difference between now and timestamp
    console.log('days',timeLeft.days(),'hours',timeLeft.hours() , 'min',timeLeft.minutes() , 'econd',timeLeft.seconds());
    return timeLeft
}, 1000);
}

endAfterounter(){ 
  let offset =  momentTz().utcOffset()
  let newDate = momentObj(this.mzd['end']).add(); 
   console.log('init',this.mzd['end'],'sdfs',offset,'newDate',momentObj(newDate).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') )
  return new Observable<object>((observer: Observer<object>) => {
    setInterval(() => observer.next(
      {da:this.memnto(newDate).days().toString(),hr: this.memnto(newDate).hours().toString() ,mn:this.memnto(newDate).minutes().toString(),sc:this.memnto(newDate).seconds().toString()}
      ), 1000);
  });
}

memnto(newDate){  
    return momentObj.duration(momentObj(newDate).diff(momentObj()));
}


 
validationPrice(type?){ 
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
   // not more than oppenning price 
   if( this.availRounds == 0 ){
    if(type == 'btn'){
     this.showError = true
     this.msgError = 'انتهي عدد محاولاتك'
    }else{ 
     this.presentToast('انتهي عدد محاولاتك', 'danger')
     return true
    }
   }  
   else if( this.bidPrice <= this.mzd['productPrice'] - (0.3 * this.mzd['productPrice'])){
     if(type == 'btn'){
      this.showError = true
      this.msgError = 'أقل من السعر الإفتتاحي'
     }else{ 
      this.presentToast('يحب المزايدة باعلي من السعر الإفتتاحي', 'danger')
      return true
     }
    } else if( this.bidPrice <= h){ // not  more than hhiiest bid 
    if(type == 'btn'){
      this.showError = true
      this.msgError ='اقل من المطلوب'
     }else{
      this.presentToast('المبلغ اقل من المطلوب', 'danger')
      this.presentToast('', 'danger')
      return false
     }
    } else if( this.bidPrice >= this.mzd['productPrice']){  // not more than product price
    if(type == 'btn'){
      this.showError = true
      this.msgError ='اعلي من سعر المنتج'
     }else{
      this.presentToast('المبلغ اعلي من سعر المنتج', 'danger')
      return false
     }
   }else{
    if(type == 'btn'){
      this.showError = false
     }else{ 
      return true
     }
   } 

}

bidChange(ev){
  console.log(ev)
  this.validationPrice('btn') 
}

 increase(bidPrice?){ 
 this.validationPrice('btn')
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
  if(bidPrice){
    this.bidPrice = this.bidPrice + 1
  }else{
    this.bidPrice = h + 1
  }  
  }

 decrease(bidPrice?){ 
  this.validationPrice('btn')
     let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
     if(bidPrice){
       this.bidPrice = this.bidPrice - 1
     }else{
       this.bidPrice = h 
     }    
 }

 focusBidding(ev){
  let h = this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0)
  console.log (ev.target.value , 'h',h)
  if(h == 0 && ev.target.value==0){
    this.bidPrice = (+this.mzd['productPrice'] - (0.3 * +this.mzd['productPrice'])) + 1
  }else{
    if(ev.target.value>0){
      this.bidPrice = this.bidPrice + 1
    }else{
      this.bidPrice = h + 1
    } 
  } 
 
  this.socket.userFucosBiddingInAuction([this.USER_INFO, this.mzd._id ])
 }

 unCheckFocus(){
  console.log ('unCheckFocus')
  this.socket.userFucosLostBiddingInAuction([this.USER_INFO, this.mzd._id ])
  //  show indicator loader jst like typing...  
 }


  endAuction(){ 
    let arr  = { 
      _id : this.mzd['_id'] ,
      auction : this.mzd
    }
    console.log('auction',arr) 
    this.api.endAuctionOntime(arr).subscribe(data =>{
    console.log('auction update',data) 
       
   // نهاي المزاد دالة في الباكند بتنهي المزاد 
   // وتعمل بوش نوتيف بإستخدام السوكيت لكل المساخدمين المتصيلين 
   // push notif for offline users of auction 
   //صفحة اللايف ح تستقبل الأوردور من الباكند وتظهر رسالة للمستخدمين 
   //  خاصة رسالة الفائز  تقوم بتوجيه الي صفحة الطلبات 
   
   // يتحول المزاد للصفحة الأوردرات


   // صفحة الأوردرات تعامل معاملة السلة 
   // تبرمج بإستخدام behavior subject 
    }, (err) => {
    console.log(err);
    })  
   
 
 }

 bidding(){ 
  if(this.validationPrice('submit') == true){
      let arr  = { 
        _id : this.mzd['_id'] ,
        log :[{
          "userId": this.USER_INFO._id ,
          "time":  new Date() ,
          "pay" : +this.bidPrice,
          "lastHighestPay": this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0) 
        }] 
      }

      // let arr  = { 
      //   _id : this.mzd['_id'] ,
      //   users :[{
      //     "userId":"736fc6299c3a4269ace43b7641014af2",
      //     "status":1
      //    },
      //    {
      //     "userId":"700865bcaa934e5ebe956a2013c33395",
      //     "status":1
      //    },
      //    {
      //     "userId":"88a8ff31502e4ad5b43152a4befa4756" ,
      //     "status":1
      //    } ] 
      // }

        this.api.updateAuctionsLog(arr).subscribe(data =>{
        console.log('auction update',data) 
        this.mzd = data['updatedLogAuction']
        console.log(this.mzd)
        // update log and hiegst price and
        this.prepareAuc()
        // animate heighst price and hand bidding
        this.animateLogAndprice()
        //alert others by new price using socket.io for room
        this.prepareBidding()  
        // let res = data['auction'][0]
        // this.mzad = res
        // console.log('im here baby',this.mzad)
      }, (err) => {
      console.log(err);
      this.handelErrorBiding(err.error.error)
      })  
      // 
        // add record to log 
        // animate input and highest bidding price
        // it done by addedd animation classes
        //show alert for other users using sockit 
        // it done by subiscribe  in ng on it  
  } 
}

    handelErrorBiding(err){
      // if (err.error == "No user with this phone found") {
      //     console.log('no user was found')  
      //   } else if (err.error == "another phone") { 
      //     this.presentToast('seem you use another phone','danger') 
      //   } else { 
      //     this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
      //     console.log(err.kind)
      //   } 
        this.presentToast('حدث خطأ ما ,حاول مرة اخري','danger')
    }
 

prepareBidding(){ 
  let log =[{
    "userId": this.USER_INFO._id , 
    "time":  new Date() ,
    "pay" : +this.bidPrice,
    "lastHighestPay": this.mzd['logs'].reduce((acc, shot) => acc = acc > shot.pay ? acc : shot.pay, 0) 
  }] 
  this.socket.userBiddingInAuction([log ,this.USER_INFO, this.mzd._id ])
}

animateLogAndprice(){
  this.showMe =true
  setTimeout(() => {
  this.showMe = false
}, 3000);
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

 //extra fuction
 getOffsetUtc(){
  let time = momentTz().tz('Africa/Cairo').format('HH:mm:ss z')
  let off =  momentTz(new Date()).utcOffset()
  let local = momentTz.tz.guess(this.mzd['end'])
  console.log('time' , time , 'offset' ,off ,'local' ,local)  
}

updateAuction(){
  // let st : Date = new Date('2022-11-11T21:35:03.976+00:00')
  // let en : Date = new Date('2022-11-11T21:35:03.976+00:00')
  // this.mzd[0].descr = '7ghutyasdadas'
  // this.mzd[0].fee = 19990000
  // this.mzd[0].start = st
  // this.mzd[0].end = en
  // this.mzd[0].logs.push({
  //  "price":123123,
  //  "userId":"kejrhoqieurhoq",
  //  "date":en
  // })
   
   this.api.updateAuctions(this.mzd[0]).subscribe(data =>{
   console.log('auction update',data)
   this.mzd = data['updatedLogAuction']
   console.log(this.mzd)
   // update log and hiegst price and
   // animate heighst price and hand bidding
   //alert others by new price using socket.io for room

   
   // let res = data['auction'][0]
   // this.mzad = res
   // console.log('im here baby',this.mzad)
 }, (err) => {
 console.log(err);
})  

}

updateTerms(){
 let arr  = { 
        _id : this.mzd['_id'] ,
        terms :[{
          "descr":"loakajskdfhdlak",
          "orderId":1
         },
         {
          "userId":"loakajskdfhdlak",
          "status":2
         },
         {
          "userId":"loakajskdfhdlak" ,
          "status":1
         } ] 
      } 

      this.api.updateAuctionsLog(arr).subscribe(data =>{
        console.log('auction update',data) 
        // this.mzd = data['updatedLogAuction']
        // console.log(this.mzd)
      })
}



}
